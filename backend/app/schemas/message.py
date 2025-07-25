from pydantic import BaseModel
from datetime import datetime

class MessageCreate(BaseModel):
    receiver_id: int
    text: str

class MessageOut(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    text: str
    created_at: datetime

    class Config:
        orm_mode = True 