from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PostCreate(BaseModel):
    content: Optional[str] = None
    image_url: Optional[str] = None
    video_url: Optional[str] = None

class PostOut(PostCreate):
    id: int
    owner_id: int
    created_at: datetime

    class Config:
        orm_mode = True
