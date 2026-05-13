from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import Optional, List
import jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
import sqlite3
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# SSO Configuration
SSO_CLIENT_ID = os.getenv("SSO_CLIENT_ID")
SSO_CLIENT_SECRET = os.getenv("SSO_CLIENT_SECRET")
SSO_ISSUER = os.getenv("SSO_ISSUER", "https://api.wytnet.com")

def get_jwks():
    import requests
    try:
        return requests.get(f"{SSO_ISSUER}/.well-known/jwks.json").json()
    except Exception:
        return {"keys": []}

def verify_sso_token(token: str) -> dict:
    try:
        headers = jwt.get_unverified_header(token)
        kid = headers.get("kid")
        jwks = get_jwks()
        key_data = next((k for k in jwks["keys"] if k["kid"] == kid), None)
        
        if not key_data:
            print(f"DEBUG: No key found for kid: {kid}")
            raise HTTPException(status_code=401, detail="Invalid token key")
            
        from jwt.algorithms import RSAAlgorithm
        public_key = RSAAlgorithm.from_jwk(key_data)
        
        return jwt.decode(
            token,
            public_key,
            algorithms=["RS256"],
            issuer=SSO_ISSUER,
            options={"verify_aud": False}
        )
    except Exception as e:
        print(f"DEBUG: verify_sso_token failed: {str(e)}")
        raise

# Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-this-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "480"))
BACKEND_PORT = int(os.getenv("BACKEND_PORT", "8001"))

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Setup
DB_PATH = "users.db"

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            username TEXT PRIMARY KEY,
            email TEXT UNIQUE,
            hashed_password TEXT
        )
    """)
    conn.commit()
    conn.close()

init_db()

class User(BaseModel):
    username: str
    email: str

class UserCreate(BaseModel):
    username: str
    password: str
    email: str

class Token(BaseModel):
    access_token: str
    token_type: str

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@app.post("/register")
async def register(user: UserCreate):
    conn = get_db()
    try:
        hashed_password = get_password_hash(user.password)
        conn.execute(
            "INSERT INTO users (username, email, hashed_password) VALUES (?, ?, ?)",
            (user.username, user.email, hashed_password)
        )
        conn.commit()
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Username or Email already registered")
    finally:
        conn.close()
    return {"message": "User created successfully"}

@app.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    conn = get_db()
    # Search by username OR email
    user = conn.execute(
        "SELECT * FROM users WHERE username = ? OR email = ?",
        (form_data.username, form_data.username)
    ).fetchone()
    conn.close()

    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user["username"]})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=User)
async def read_users_me(token: str = Depends(oauth2_scheme)):
    try:
        # Check if it's an SSO token (usually long and has RS256 headers)
        unverified_payload = jwt.decode(token, options={"verify_signature": False})
        iss = unverified_payload.get("iss")
        print(f"DEBUG: Verifying token with iss: {iss} (Configured SSO_ISSUER: {SSO_ISSUER})")
        
        if iss == SSO_ISSUER:
            payload = verify_sso_token(token)
            return {"username": payload.get("email") or payload.get("sub"), "email": payload.get("email")}
            
        # Fallback to local token verification
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
            
        conn = get_db()
        user = conn.execute("SELECT username, email FROM users WHERE username = ?", (username,)).fetchone()
        conn.close()
        
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        return {"username": user["username"], "email": user["email"]}
        
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Token verification failed: {str(e)}")

@app.post("/sso/callback")
async def sso_callback(data: dict):
    try:
        code = data.get("code")
        code_verifier = data.get("code_verifier")
        import requests
        
        # Exchange code for token
        token_url = f"{SSO_ISSUER}/oauth/token"
        payload = {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": os.getenv("SSO_REDIRECT_URI"),
            "client_id": SSO_CLIENT_ID,
            "client_secret": SSO_CLIENT_SECRET,
            "code_verifier": code_verifier
        }
        
        print(f"DEBUG: Attempting token exchange with {token_url}")
        resp = requests.post(token_url, data=payload)
        
        if not resp.ok:
            print(f"DEBUG: SSO Provider returned error: {resp.status_code} - {resp.text}")
            raise HTTPException(status_code=400, detail=f"SSO exchange failed: {resp.text}")
            
        return resp.json()
    except Exception as e:
        print(f"DEBUG: Internal Server Error in sso_callback: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=BACKEND_PORT)
