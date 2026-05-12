from fastapi import APIRouter, Depends, HTTPException, status
from backend.models import UserCreate, UserLogin, Token, UserResponse
from backend.database import get_db, User
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import hashlib
import secrets
from backend.config import settings

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    return f"{salt}:{hashlib.sha256((salt + password).encode()).hexdigest()}"


def verify_password(password: str, hashed: str) -> bool:
    salt, hsh = hashed.split(":")
    return hsh == hashlib.sha256((salt + password).encode()).hexdigest()


def create_token(username: str) -> str:
    expiry = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    token_data = f"{username}:{expiry.timestamp()}:{settings.secret_key}"
    token = hashlib.sha256(token_data.encode()).hexdigest()
    return token


@router.post("/register", response_model=Token)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(
        (User.username == user.username) | (User.email == user.email)
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered",
        )

    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password),
        created_at=datetime.utcnow(),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    token = create_token(user.username)
    return Token(access_token=token)


@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    token = create_token(user.username)
    return Token(access_token=token)


@router.get("/me", response_model=UserResponse)
def get_me(username: str = "", db: Session = Depends(get_db)):
    if not username:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        created_at=user.created_at.isoformat(),
    )
