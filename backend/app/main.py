from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.routes import auth
from app.routes import post 
from app.routes import comment
from app.routes import like
from app.routes import follow
from app.routes import message
app = FastAPI()
app.mount("/media", StaticFiles(directory="media"), name="media")
@app.get("/")
def read_root():
    return {"message": "Welcome to your Social Media API"}

app.include_router(auth.router,prefix="/api")
app.include_router(post.router,prefix="/posts")
app.include_router(comment.router, prefix="/comments")
app.include_router(like.router, prefix="/likes")
app.include_router(follow.router, prefix="/follows")
app.include_router(message.router, prefix="/messages")
