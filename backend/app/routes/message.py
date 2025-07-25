from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.schemas.message import MessageCreate, MessageOut
from app.servicess.message import send_message, get_messages_between_users, delete_message
from app.utils.dependencies import get_db, get_current_user
from app.models.user import User

router = APIRouter(prefix="/messages", tags=["Messages"])

@router.post("/", response_model=MessageOut)
def send_message_route(message: MessageCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return send_message(db, current_user, message)

@router.get("/with/{user_id}", response_model=List[MessageOut])
def list_messages(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_messages_between_users(db, current_user.id, user_id)

@router.delete("/{message_id}")
def remove_message(message_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return delete_message(db, current_user, message_id) 