from datetime import timedelta, datetime, timezone
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from jose import jwt
from dotenv import load_dotenv
import os
from models import User, Admin
from deps import db_dependency, bcrypt_context

load_dotenv()

router = APIRouter(
    prefix='/auth',
    tags=['auth']
)

SECRET_KEY = os.getenv("AUTH_SECRET_KEY")
ALGORITHM = os.getenv("AUTH_ALGORITHM")

class UserCreateRequest(BaseModel):
    username: str
    email: str
    phone: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

def authenticate_user(username: str, password: str, db):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        return False
    if not bcrypt_context.verify(password, user.password):
        return False
    return user

def authenticate_admin(username: str, password: str, db):
    admin = db.query(Admin).filter(Admin.username == username).first()
    if not admin:
        return False
    if not bcrypt_context.verify(password, admin.password):
        return False
    return admin

def create_access_token(username: str, user_id: int, role: str, expires_delta: timedelta):
    encode = {'sub': username, 'id': user_id, 'role': role}
    expires = datetime.now(timezone.utc) + expires_delta
    encode.update({'exp': expires})
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_user(db: db_dependency, create_user_request: UserCreateRequest):
    create_user_model = User(
        username=create_user_request.username,
        email=create_user_request.email,
        phone=create_user_request.phone,
        password=bcrypt_context.hash(create_user_request.password),
    )
    db.add(create_user_model)
    db.commit()

@router.post('/token', response_model=Token)
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: db_dependency):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate user")
    token = create_access_token(user.username, user.id, 'user', timedelta(minutes=20))

    return {'access_token': token, 'token_type': 'bearer'}

@router.post('/admin/token', response_model=Token)
async def login_admin_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: db_dependency):
    admin = authenticate_admin(form_data.username, form_data.password, db)
    if not admin:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate admin")
    token = create_access_token(admin.username, admin.id, 'admin', timedelta(minutes=20))

    return {'access_token': token, 'token_type': 'bearer'}



    
