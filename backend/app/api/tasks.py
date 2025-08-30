from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, delete, DateTime
from sqlalchemy.orm import Session, Mapped, mapped_column
from datetime import datetime, timezone
from app.db import Base, engine, SessionLocal
from app.schemas.task import TaskIn, TaskOut

router = APIRouter(prefix="/api/v1/tasks", tags=["tasks"])


class Task(Base):
    __tablename__ = "tasks"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str]
    completed: Mapped[bool] = mapped_column(default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )


Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=list[TaskOut])
def list_tasks(db: Session = Depends(get_db)):
    tasks = db.execute(select(Task).order_by(Task.id.desc())).scalars().all()
    # Ensure all timestamps are timezone-aware (UTC)
    for task in tasks:
        if task.created_at.tzinfo is None:
            task.created_at = task.created_at.replace(tzinfo=timezone.utc)
    return tasks


@router.post("/", response_model=TaskOut, status_code=201)
def create_task(payload: TaskIn, db: Session = Depends(get_db)):
    t = Task(title=payload.title)
    db.add(t)
    db.commit()
    db.refresh(t)
    # Ensure timestamp is timezone-aware (UTC)
    if t.created_at.tzinfo is None:
        t.created_at = t.created_at.replace(tzinfo=timezone.utc)
    return t


@router.put("/{task_id}", response_model=TaskOut)
def update_task(
    task_id: int,
    completed: bool | None = None,
    title: str | None = None,
    db: Session = Depends(get_db),
):
    t = db.get(Task, task_id)
    if not t:
        raise HTTPException(404, "Task not found")
    if completed is not None:
        t.completed = completed
    if title is not None:
        t.title = title
    db.commit()
    db.refresh(t)
    # Ensure timestamp is timezone-aware (UTC)
    if t.created_at.tzinfo is None:
        t.created_at = t.created_at.replace(tzinfo=timezone.utc)
    return t


@router.delete("/{task_id}", status_code=204)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    res = db.execute(delete(Task).where(Task.id == task_id))
    if res.rowcount == 0:
        raise HTTPException(404, "Task not found")
    db.commit()


@router.get("/debug/latest", response_model=dict)
def debug_latest_task(db: Session = Depends(get_db)):
    """Debug endpoint to check the latest task's timestamp format"""
    task = db.execute(select(Task).order_by(Task.id.desc()).limit(1)).scalar_one_or_none()
    if not task:
        return {"message": "No tasks found"}
    
    # Raw timestamp info
    raw_created_at = task.created_at
    return {
        "id": task.id,
        "title": task.title,
        "raw_created_at": str(raw_created_at),
        "created_at_type": str(type(raw_created_at)),
        "has_tzinfo": raw_created_at.tzinfo is not None,
        "tzinfo": str(raw_created_at.tzinfo) if raw_created_at.tzinfo else None,
        "isoformat": raw_created_at.isoformat(),
        "utc_isoformat": raw_created_at.replace(tzinfo=timezone.utc).isoformat() if raw_created_at.tzinfo is None else raw_created_at.isoformat()
    }
