from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.schemas.follow import FollowCreate, FollowOut
from app.servicess.follow import follow_user, unfollow_user, get_followers, get_following
from app.utils.dependencies import get_db, get_current_user
from app.models.user import User

router = APIRouter(prefix="/follows", tags=["Follows"])

@router.post("/", response_model=FollowOut)
def follow_user_route(follow: FollowCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return follow_user(db, current_user, follow)

@router.delete("/user/{following_id}")
def unfollow_user_route(following_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return unfollow_user(db, current_user, following_id)

@router.get("/followers/{user_id}", response_model=List[FollowOut])
def list_followers(user_id: int, db: Session = Depends(get_db)):
    return get_followers(db, user_id)

@router.get("/following/{user_id}", response_model=List[FollowOut])
def list_following(user_id: int, db: Session = Depends(get_db)):
    return get_following(db, user_id) 