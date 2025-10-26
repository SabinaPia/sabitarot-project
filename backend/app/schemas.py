from pydantic import BaseModel
from typing import List
from datetime import datetime

# ---------------------
# Readings
# ---------------------
class ReadingBase(BaseModel):
    question: str
    answer: str

class ReadingCreate(ReadingBase):
    pass

class Reading(ReadingBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True

# ---------------------
# Users
# ---------------------
class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class UserLogin(UserBase):
    password: str  # para login con POST

class User(UserBase):
    id: int
    created_at: datetime
    readings: List[Reading] = []

    class Config:
        orm_mode = True
