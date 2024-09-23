from pydantic import BaseModel
from typing import Optional

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

class Update_Req_Group(BaseModel):
    id:str
    name:Optional[str]
    des:Optional[str]

    class Config:
        from_attributes=True

class AddDeleteUserGroupReq(BaseModel):
    group_id:str
    user_id:str
