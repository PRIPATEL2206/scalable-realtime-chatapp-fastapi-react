from pydantic import BaseModel
from datetime import datetime
from auth.response_models import Response_User

class Chat(BaseModel):
    id:str
    sender_id:Response_User
    group_id:str
    msg:str
    created_at:datetime

class Group(BaseModel):
    id:str
    name:str
    des:str=""
