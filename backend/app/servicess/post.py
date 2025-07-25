from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.post import Post
from app.models.user import User
from app.schemas.post import PostCreate
from typing import List

def create_post(post_data: PostCreate, db: Session, current_user: User):
    new_post = Post(
        title=post_data.title,
        content=post_data.content,
        media_url=post_data.media_url,
        user_id=current_user.id
    )
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post

def get_all_posts(db: Session) -> List[Post]:
    return db.query(Post).all()

def get_post_by_id(post_id: int, db: Session):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

def get_posts_by_user_id(db: Session, user_id: int):
    return db.query(Post).filter(Post.user_id == user_id).all()

def get_posts_by_current_user(db: Session, current_user: User):
    return db.query(Post).filter(Post.user_id == current_user.id).all()

def delete_post_by_id(post_id: int, db: Session, current_user: User):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this post")
    db.delete(post)
    db.commit()
    return {"detail": "Post deleted successfully"}

