from pydantic import BaseModel
from datetime import datetime
from auth.response_models import Response_User

class Req_Chat(BaseModel):
    group_id:str
    msg:str
    is_conection_req:bool=False

    class Config:
        from_attributes=True

class Req_Group(BaseModel):
    name:str
    is_individual_group:bool=False
    des:str=""

    class Config:
        from_attributes=True
