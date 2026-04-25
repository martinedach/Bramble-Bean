from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from database import get_db
from models import FeedbackSubmission
from schemas import FeedbackCreate, FeedbackResponse

router = APIRouter(tags=["feedback"])

SessionDep = Annotated[Session, Depends(get_db)]


@router.post(
    "/feedback",
    response_model=FeedbackResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_feedback(payload: FeedbackCreate, db: SessionDep) -> FeedbackSubmission:
    row = FeedbackSubmission(
        email=payload.email,
        comment=payload.comment,
        rating=payload.rating,
        highlight=payload.highlight.value,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return row
