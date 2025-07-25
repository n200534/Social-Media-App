from pydantic import BaseModel

class LikeCreate(BaseModel):
    post_id: int

class LikeOut(BaseModel):
    id: int
    user_id: int
    post_id: int

    class Config:
        orm_mode = True 