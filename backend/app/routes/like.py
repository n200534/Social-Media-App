from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.schemas.like import LikeCreate, LikeOut
from app.servicess.like import like_post, unlike_post, get_likes_by_post
from app.utils.dependencies import get_db, get_current_user
from app.models.user import User

router = APIRouter(prefix="/likes", tags=["Likes"])

@router.post("/", response_model=LikeOut)
def like_post_route(like: LikeCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return like_post(db, current_user, like)

@router.delete("/post/{post_id}")
def unlike_post_route(post_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return unlike_post(db, current_user, post_id)

@router.get("/post/{post_id}", response_model=List[LikeOut])
def list_likes(post_id: int, db: Session = Depends(get_db)):
    return get_likes_by_post(db, post_id) 