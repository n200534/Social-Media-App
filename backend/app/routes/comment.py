from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.schemas.comment import CommentCreate, CommentOut
from app.servicess.comment import add_comment, get_comments_by_post, delete_comment
from app.utils.dependencies import get_db, get_current_user
from app.models.user import User

router = APIRouter(prefix="/comments", tags=["Comments"])

@router.post("/", response_model=CommentOut)
def create_comment(comment: CommentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return add_comment(db, current_user, comment)

@router.get("/post/{post_id}", response_model=List[CommentOut])
def list_comments(post_id: int, db: Session = Depends(get_db)):
    return get_comments_by_post(db, post_id)

@router.delete("/{comment_id}")
def remove_comment(comment_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return delete_comment(db, current_user, comment_id) 