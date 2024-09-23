
from fastapi import APIRouter,WebSocket,Depends
from auth.dependency import get_curent_user_from_tocken
from db.base_db import get_db
from auth.db_models import User
from sqlalchemy.orm import Session
from gemini_chat_bot.response_models import Res_anser
from chat_websockets.constants import Events
from datetime import datetime
from utils.massage_builder import MassageBuilder
import json

import google.generativeai as genai
import os


router = APIRouter(
    prefix="/gemini",
 tags=["chats_websocket"],
)

# get model
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
model = genai.GenerativeModel("gemini-1.5-flash")


# chat = model.start_chat(
#     history=[
#         {"role": "user", "parts": "Hello"},
#         {"role": "model", "parts": "Great to meet you. What would you like to know?"},
#     ]
# )
# response = chat.send_message("I have 2 dogs in my house.")
# response = chat.send_message("How many paws are in my house?",stream=True)
# for chunk in response:
#     print(chunk.text)
#     print("//////////")


@router.websocket("/chat")
async def websocket_endpoint(websocket:WebSocket,db:Session=Depends(get_db)):
    await websocket.accept()
    user:User=None
    chat:genai.ChatSession=None
    try:
        while True:
                data:dict = json.loads( await websocket.receive_text())
                print(data)
                event=data["event"]
                data=data["data"]

                print(user)
                match event :
                    case Events.AUTHORIZATION:
                        token=data["Authorization"]
                        print(token)
                        user = await get_curent_user_from_tocken(token=token)
                        chat = model.start_chat(
                            history=[
                                {"role": "user", "parts": "Hello"},
                                {"role": "model", "parts": "Great to meet you. What would you like to know?"},
                            ]
                        )
                    
                    case Events.MASSAGE_SEND if user!=None:
                        prompt=data["prompt"]
                        response = chat.send_message(prompt,stream=True)
                        for chunk in response:
                            chat_res=Res_anser(
                                 msg=chunk.text,
                                 created_at=datetime.now()
                            )
                            await websocket.send_text(MassageBuilder.build_massage_recive_event(chat_res.model_dump_json())) 

    except Exception as e:
         websocket.close()
         print(e)
         




