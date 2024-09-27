from dotenv import load_dotenv

# load envs
load_dotenv()

from fastapi import FastAPI,Depends
from fastapi.middleware.cors import CORSMiddleware
from auth.response_models import Response_User
from auth.dependency import get_current_user
from db.base_db import create_tables
from auth.routes import router as auth_router
from chat_websockets.routes import router as chat_websocket_router

from gemini_chat_bot.routes import router as gemini_routes

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

@app.get("/helthy")
def helth_check():
    return "ok"

app.include_router(auth_router)
app.include_router(chat_websocket_router)
app.include_router(gemini_routes)

create_tables()


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app)
