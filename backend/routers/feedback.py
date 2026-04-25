from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session

from database import get_db
from models import FeedbackSubmission
from schemas import FeedbackCreate, FeedbackResponse

router = APIRouter(tags=["feedback"])

SessionDep = Annotated[Session, Depends(get_db)]


@router.get(
    "/feedback",
    response_model=list[FeedbackResponse],
    status_code=status.HTTP_200_OK,
)
def list_feedback(
    db: SessionDep,
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
) -> list[FeedbackSubmission]:
    return (
        db.query(FeedbackSubmission)
        .order_by(FeedbackSubmission.created_at.desc(), FeedbackSubmission.id.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )


@router.post(
    "/feedback",
    response_model=FeedbackResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_feedback(payload: FeedbackCreate, db: SessionDep) -> FeedbackSubmission:
    existing = (
        db.query(FeedbackSubmission)
        .filter(
            FeedbackSubmission.email == payload.email,
            FeedbackSubmission.comment == payload.comment,
            FeedbackSubmission.rating == payload.rating,
            FeedbackSubmission.highlight == payload.highlight.value,
        )
        .first()
    )
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Duplicate feedback submission detected for this customer.",
        )

    row = FeedbackSubmission(
        email=payload.email,
        comment=payload.comment,
        rating=payload.rating,
        highlight=payload.highlight.value,
    )
    db.add(row)
    try:
        db.commit()
        db.refresh(row)
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Feedback submission violates a data constraint.",
        ) from exc
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database temporarily unavailable. Please try again.",
        ) from exc
    return row
