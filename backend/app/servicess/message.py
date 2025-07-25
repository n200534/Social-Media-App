from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.message import Message
from app.models.user import User
from app.schemas.message import MessageCreate
from typing import List

def send_message(db: Session, sender: User, message_data: MessageCreate):
    message = Message(sender_id=sender.id, receiver_id=message_data.receiver_id, text=message_data.text)
    db.add(message)
    db.commit()
    db.refresh(message)
    return message

def get_messages_between_users(db: Session, user1_id: int, user2_id: int) -> List[Message]:
    return db.query(Message).filter(
        ((Message.sender_id == user1_id) & (Message.receiver_id == user2_id)) |
        ((Message.sender_id == user2_id) & (Message.receiver_id == user1_id))
    ).order_by(Message.created_at).all()

def delete_message(db: Session, user: User, message_id: int):
    message = db.query(Message).filter(Message.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    if message.sender_id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this message")
    db.delete(message)
    db.commit()
    return {"detail": "Message deleted successfully"} 