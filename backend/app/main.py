from fastapi import FastAPI
from app.routes import auth

app = FastAPI()
@app.get("/")
def read_root():
    return {"message": "Welcome to your Social Media API"}

app.include_router(auth.router,prefix="/api")
