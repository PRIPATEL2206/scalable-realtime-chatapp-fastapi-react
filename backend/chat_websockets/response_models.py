from pydantic import BaseModel
from datetime import datetime
from auth.response_models import Response_User

class Res_Chat(BaseModel):
    id:str
    sender_id:str
    group_id:str
    msg:str
    is_conection_req:bool=False
    created_at:datetime

    class Config:
        from_attributes=True

class Res_Group(BaseModel):
    id:str
    name:str
    is_individual_group:bool
    created_by:str
    created_at:datetime
    last_updated:datetime
    des:str=""


    class Config:
        from_attributes=True

