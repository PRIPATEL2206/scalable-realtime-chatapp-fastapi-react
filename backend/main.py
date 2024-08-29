from fastapi import FastAPI,Depends
from fastapi.middleware.cors import CORSMiddleware
from auth.response_models import Response_User
from auth.dependency import get_current_user
from db.base_db import create_tables
from auth.routes import router as auth_router
from chat_websockets.routes import router as chat_websocket_router

app= FastAPI()

origins=["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
def home(user:Response_User=Depends(get_current_user)):
    return {"name":user.email}

app.include_router(auth_router)
app.include_router(chat_websocket_router)

create_tables()