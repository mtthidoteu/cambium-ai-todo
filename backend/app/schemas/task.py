from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Annotated


class TaskIn(BaseModel):
    title: str = Field(..., min_length=1, description="Task title cannot be empty")


class TaskOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    title: str
    completed: bool
    created_at: datetime
