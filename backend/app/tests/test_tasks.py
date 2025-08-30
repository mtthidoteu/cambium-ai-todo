import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_create_and_list_tasks():
    """Happy path: Create a task and verify it appears in the list"""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        # Create a task
        r = await ac.post("/api/v1/tasks/", json={"title": "Write README"})
        assert r.status_code == 201
        task = r.json()
        assert task["title"] == "Write README"
        assert task["completed"] is False
        assert "id" in task
        assert "created_at" in task
        
        # Verify it appears in the list
        r2 = await ac.get("/api/v1/tasks/")
        assert r2.status_code == 200
        tasks = r2.json()
        assert any(t["id"] == task["id"] for t in tasks)


@pytest.mark.asyncio
async def test_complete_task_workflow():
    """Happy path: Create, update, and delete task workflow"""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        # Create task
        r = await ac.post("/api/v1/tasks/", json={"title": "Test task"})
        assert r.status_code == 201
        task = r.json()
        task_id = task["id"]
        
        # Update task to completed
        r = await ac.put(f"/api/v1/tasks/{task_id}?completed=true")
        assert r.status_code == 200
        updated_task = r.json()
        assert updated_task["completed"] is True
        assert updated_task["title"] == "Test task"
        
        # Update task title
        r = await ac.put(f"/api/v1/tasks/{task_id}?title=Updated task")
        assert r.status_code == 200
        updated_task = r.json()
        assert updated_task["title"] == "Updated task"
        assert updated_task["completed"] is True  # Should preserve completed status
        
        # Delete task
        r = await ac.delete(f"/api/v1/tasks/{task_id}")
        assert r.status_code == 204
        
        # Verify task is deleted
        r = await ac.get("/api/v1/tasks/")
        tasks = r.json()
        assert not any(t["id"] == task_id for t in tasks)


@pytest.mark.asyncio
async def test_update_missing_returns_404():
    """Edge case: Updating non-existent task returns 404"""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        r = await ac.put("/api/v1/tasks/999999?completed=true")
        assert r.status_code == 404


@pytest.mark.asyncio
async def test_delete_missing_returns_404():
    """Edge case: Deleting non-existent task returns 404"""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        r = await ac.delete("/api/v1/tasks/999999")
        assert r.status_code == 404


@pytest.mark.asyncio
async def test_create_task_validation():
    """Edge case: Task creation with invalid/missing data"""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        # Test empty title
        r = await ac.post("/api/v1/tasks/", json={"title": ""})
        assert r.status_code == 422  # Validation error
        
        # Test missing title
        r = await ac.post("/api/v1/tasks/", json={})
        assert r.status_code == 422  # Validation error
        
        # Test invalid JSON structure
        r = await ac.post("/api/v1/tasks/", json={"invalid_field": "value"})
        assert r.status_code == 422  # Validation error


@pytest.mark.asyncio
async def test_empty_task_list():
    """Edge case: Empty task list returns empty array"""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        # Clear any existing tasks first by getting and deleting them
        r = await ac.get("/api/v1/tasks/")
        tasks = r.json()
        for task in tasks:
            await ac.delete(f"/api/v1/tasks/{task['id']}")
        
        # Now verify empty list
        r = await ac.get("/api/v1/tasks/")
        assert r.status_code == 200
        assert r.json() == []
