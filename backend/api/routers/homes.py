from pydantic import BaseModel
from typing import Optional
from fastapi import APIRouter, status

from models import Home
from deps import db_dependency, user_dependency

router = APIRouter(
    prefix="/homes",
    tags=["homes"]
)

class HomeBase(BaseModel):
    name: str

class HomeCreate(HomeBase):
    pass

@router.get('/')
def get_home(db: db_dependency, user: user_dependency, home_id: int):
    return db.query(Home).filter(Home.id == home_id).first()

@router.get('/homes')
def get_homes(db: db_dependency, user: user_dependency):
    return db.query(Home).all()

@router.post('/', status_code=status.HTTP_201_CREATED)
def create_home(db: db_dependency, user: user_dependency, home: HomeCreate):
    db_home = Home(**home.model_dump(), owner_id=user.get('id'))
    db.add(db_home)
    db.commit()
    db.refresh(db_home)
    return db_home

@router.delete('/')
def delete_home(db: db_dependency, user: user_dependency, home_id: int):
    db_home = db.query(Home).filter(Home.id==home_id).first()
    if db_home:
        db.delete(db_home)
        db.commit()
    return db_home
