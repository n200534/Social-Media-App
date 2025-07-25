from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.follows import Follow
from app.models.user import User
from app.schemas.follow import FollowCreate
from typing import List

def follow_user(db: Session, user: User, follow_data: FollowCreate):
    existing = db.query(Follow).filter(Follow.follower_id == user.id, Follow.following_id == follow_data.following_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already following this user")
    follow = Follow(follower_id=user.id, following_id=follow_data.following_id)
    db.add(follow)
    db.commit()
    db.refresh(follow)
    return follow

def unfollow_user(db: Session, user: User, following_id: int):
    follow = db.query(Follow).filter(Follow.follower_id == user.id, Follow.following_id == following_id).first()
    if not follow:
        raise HTTPException(status_code=404, detail="Follow not found")
    db.delete(follow)
    db.commit()
    return {"detail": "Unfollowed successfully"}

def get_followers(db: Session, user_id: int) -> List[Follow]:
    return db.query(Follow).filter(Follow.following_id == user_id).all()

def get_following(db: Session, user_id: int) -> List[Follow]:
    return db.query(Follow).filter(Follow.follower_id == user_id).all() 