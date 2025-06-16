from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from app.core.database import Base

class Follow(Base):
    __tablename__ = "follows"
    __table_args__ = (UniqueConstraint('follower_id', 'following_id', name='unique_follow'),)

    id = Column(Integer, primary_key=True, index=True)
    follower_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    following_id = Column(Integer, ForeignKey("users.id"), nullable=False)
