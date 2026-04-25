from datetime import datetime
from enum import Enum
import re

from pydantic import BaseModel, Field, field_validator


class Highlight(str, Enum):
    food = "Food"
    coffee = "Coffee"
    service = "Service"
    atmosphere = "Atmosphere"


_EMAIL_RE = re.compile(
    r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$",
)


class FeedbackCreate(BaseModel):
    email: str = Field(max_length=320)
    comment: str = Field(min_length=1, max_length=10_000)
    rating: int = Field(ge=1, le=5)
    highlight: Highlight

    @field_validator("email")
    @classmethod
    def email_format(cls, v: str) -> str:
        s = v.strip()
        if not _EMAIL_RE.match(s):
            raise ValueError("invalid email format")
        return s

    @field_validator("comment")
    @classmethod
    def comment_stripped_non_empty(cls, v: str) -> str:
        s = v.strip()
        if not s:
            raise ValueError("comment cannot be empty")
        return s


class FeedbackResponse(BaseModel):
    model_config = {"from_attributes": True}

    id: int
    email: str
    comment: str
    rating: int
    highlight: str
    created_at: datetime
