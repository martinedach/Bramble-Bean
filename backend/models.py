from datetime import datetime

from sqlalchemy import DateTime, SmallInteger, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class FeedbackSubmission(Base):
    __tablename__ = "feedback_submissions"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(320), nullable=False)
    comment: Mapped[str] = mapped_column(Text, nullable=False)
    rating: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    highlight: Mapped[str] = mapped_column(String(32), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
