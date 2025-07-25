from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.comments import Comment
from app.models.user import User
from app.schemas.comment import CommentCreate
from typing import List

def add_comment(db: Session, user: User, comment_data: CommentCreate):
    comment = Comment(user_id=user.id, post_id=comment_data.post_id, text=comment_data.text)
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment

def get_comments_by_post(db: Session, post_id: int) -> List[Comment]:
    return db.query(Comment).filter(Comment.post_id == post_id).all()

def delete_comment(db: Session, user: User, comment_id: int):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    if comment.user_id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this comment")
    db.delete(comment)
    db.commit()
    return {"detail": "Comment deleted successfully"} 