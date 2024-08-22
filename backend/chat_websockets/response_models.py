from pydantic import BaseModel
from datetime import datetime
from auth.response_models import Response_User
from chat_websockets.db_models import Group

class Res_Chat(BaseModel):
    id:str
    sender:Response_User
    group_id:str
    msg:str
    created_at:datetime

    class Config:
        from_attributes=True

class Res_Group(BaseModel):
    id:str
    name:str
    created_by:str
    created_at:datetime
    last_updated:datetime
    des:str=""


    class Config:
        from_attributes=True

