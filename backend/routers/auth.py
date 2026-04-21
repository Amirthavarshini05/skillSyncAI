from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
import models, schemas, auth_utils
from database import get_db

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

import secrets
import email_utils

@router.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth_utils.get_password_hash(user.password)
    # Generate 6-digit OTP
    otp = str(secrets.randbelow(900000) + 100000)
    
    new_user = models.User(
        name=user.name,
        email=user.email,
        hashed_password=hashed_password,
        role=user.role,
        needs_onboarding=True,
        is_verified=False,
        otp_code=otp
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Send OTP email with delay
    email_utils.send_otp_email(new_user.email, otp)
    
    return new_user

@router.post("/login", response_model=schemas.Token)
def login(user_credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == user_credentials.email).first()
    if not user or not auth_utils.verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified. Please verify your email first.",
        )
    
    access_token_expires = timedelta(minutes=auth_utils.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth_utils.create_access_token(
        data={"sub": user.email, "role": user.role.value}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/verify-otp")
def verify_otp(data: schemas.VerifyOTP, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.otp_code == data.otp:
        user.is_verified = True
        user.otp_code = None  # Clear OTP after use
        db.commit()
        return {"message": "Email verified successfully"}
    else:
        raise HTTPException(status_code=400, detail="Invalid OTP code")

@router.post("/resend-otp")
def resend_otp(email_data: schemas.VerifyOTP, db: Session = Depends(get_db)):
    # Re-using VerifyOTP schema for basic email input
    user = db.query(models.User).filter(models.User.email == email_data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    otp = str(secrets.randbelow(900000) + 100000)
    user.otp_code = otp
    db.commit()
    email_utils.send_otp_email(user.email, otp)
    return {"message": "OTP resent successfully"}

@router.get("/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(auth_utils.get_current_user)):
    return current_user
