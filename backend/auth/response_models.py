
from pydantic import BaseModel
from typing import Optional

class User_in_out(BaseModel):
    id:Optional[str]
    email:str
    password:str

class TokenSchema(BaseModel):
    access_token:str
    refresh_token:str

class Payload(BaseModel):
    exp:int
    sub:str