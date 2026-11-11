from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.schemas import UserCreate, UserResponse, UserLogin, Token
from app.security import (
    hash_password,
    verify_password,
    create_access_token
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


# USER REGISTRATION
@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
def register_user(user_data: UserCreate, db: Session = Depends(get_db)):

    existing_email = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    existing_username = db.query(User).filter(
        User.username == user_data.username
    ).first()

    if existing_username:
        raise HTTPException(
            status_code=400,
            detail="Username already taken"
        )

    new_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hash_password(user_data.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# USER LOGIN
@router.post("/login", response_model=Token)
def login_user(user_data: UserLogin, db: Session = Depends(get_db)):

    user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if not user or not verify_password(
        user_data.password,
        user.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive"
        )

    access_token = create_access_token(user.id)

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
