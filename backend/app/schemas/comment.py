from pydantic import BaseModel
from datetime import datetime

class CommentCreate(BaseModel):
    post_id: int
    text: str

class CommentOut(BaseModel):
    id: int
    user_id: int
    post_id: int
    text: str
    created_at: datetime

    class Config:
        orm_mode = True 