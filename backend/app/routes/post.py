from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import os
from app.schemas.post import PostCreate, PostOut
from app.servicess.post import (
    create_post,
    get_all_posts,
    get_post_by_id,
    get_posts_by_user_id,
    get_posts_by_current_user,
    delete_post_by_id
)
from app.utils.dependencies import get_db, get_current_user
from app.models.user import User

router = APIRouter(prefix="/posts", tags=["Posts"])

MEDIA_DIR = "media"
os.makedirs(MEDIA_DIR, exist_ok=True)

@router.post("/", response_model=PostOut)
def create_user_post(
    content: str = Form(...),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    media_url = None
    if file:
        ext = os.path.splitext(file.filename)[1]
        filename = f"{current_user.id}_{int(os.times().elapsed)}{ext}"
        file_path = os.path.join(MEDIA_DIR, filename)
        with open(file_path, "wb") as f:
            f.write(file.file.read())
        media_url = f"/media/{filename}"
    post_data = PostCreate(content=content, image_url=media_url)
    return create_post(post_data, db, current_user)

@router.get("/", response_model=List[PostOut])
def list_all_posts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_all_posts(db)

@router.get("/me", response_model=List[PostOut])
def get_my_posts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_posts_by_current_user(db, current_user)

@router.get("/user/{user_id}", response_model=List[PostOut])
def get_user_posts(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_posts_by_user_id(db, user_id)

@router.get("/{post_id}", response_model=PostOut)
def get_post(post_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_post_by_id(post_id, db)

@router.delete("/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return delete_post_by_id(post_id, db, current_user)