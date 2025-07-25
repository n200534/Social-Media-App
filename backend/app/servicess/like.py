from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.likes import Like
from app.models.user import User
from app.schemas.like import LikeCreate
from typing import List

def like_post(db: Session, user: User, like_data: LikeCreate):
    existing = db.query(Like).filter(Like.user_id == user.id, Like.post_id == like_data.post_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already liked this post")
    like = Like(user_id=user.id, post_id=like_data.post_id)
    db.add(like)
    db.commit()
    db.refresh(like)
    return like

def unlike_post(db: Session, user: User, post_id: int):
    like = db.query(Like).filter(Like.user_id == user.id, Like.post_id == post_id).first()
    if not like:
        raise HTTPException(status_code=404, detail="Like not found")
    db.delete(like)
    db.commit()
    return {"detail": "Unliked successfully"}

def get_likes_by_post(db: Session, post_id: int) -> List[Like]:
    return db.query(Like).filter(Like.post_id == post_id).all() 