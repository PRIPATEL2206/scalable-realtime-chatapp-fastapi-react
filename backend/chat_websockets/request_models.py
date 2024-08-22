from pydantic import BaseModel
from datetime import datetime
from auth.response_models import Response_User

class Req_Chat(BaseModel):
    group_id:str
    msg:str

    class Config:
        from_attributes=True

class Req_Group(BaseModel):
    name:str
    des:str=""

    class Config:
        from_attributes=True
