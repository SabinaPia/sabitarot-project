from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app import models, schemas, crud
from app.database import engine, Base, get_db

# Crear las tablas
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SabiTarot API")

# ---------------------
# CORS
# ---------------------
origins = [
    "http://localhost:4173",  # URL de tu frontend
    "http://127.0.0.1:4173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------
# Users
# ---------------------
@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    # Guardar contraseña tal cual
    return crud.create_user(db, user)

# Login de usuario sin hash
@app.post("/login/", response_model=schemas.User)
def login_user(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, user.username)
    if not db_user or db_user.password != user.password:
        raise HTTPException(status_code=400, detail="Usuario o contraseña inválidos")
    return db_user

# ---------------------
# Readings
# ---------------------
@app.post("/users/{user_id}/readings/", response_model=schemas.Reading)
def create_reading_for_user(user_id: int, reading: schemas.ReadingCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_id(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.create_reading(db, reading, user_id)

@app.get("/users/{user_id}/readings/", response_model=list[schemas.Reading])
def get_readings(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_id(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.get_readings_by_user(db, user_id)
