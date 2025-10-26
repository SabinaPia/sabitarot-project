from sqlalchemy.orm import Session
from . import models, schemas

# ---------------------
# Users simples
# ---------------------
def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def create_user(db: Session, user: schemas.UserCreate):
    # Guardar contraseña en texto plano
    db_user = models.User(username=user.username, password=user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)
    if not user:
        return None
    if user.password != password:  # Comparación simple
        return None
    return user

# ---------------------
# Readings
# ---------------------
def create_reading(db: Session, reading: schemas.ReadingCreate, user_id: int):
    db_reading = models.Reading(**reading.dict(), user_id=user_id)
    db.add(db_reading)
    db.commit()
    db.refresh(db_reading)
    return db_reading

def get_readings_by_user(db: Session, user_id: int):
    return db.query(models.Reading).filter(models.Reading.user_id == user_id).all()
