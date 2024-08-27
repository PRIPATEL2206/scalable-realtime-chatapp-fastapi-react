
from pydantic import BaseModel
from typing import Optional

class Request_User(BaseModel):
    email:str
    password:str
    name:str

    class Config:
        from_attributes=True
    
class Response_User(BaseModel):
    id:str
    email:str
    name:str
    class Config:
        from_attributes=True


class TokenSchema(BaseModel):
    id:str
    access_token:str
    refresh_token:str

    class Config:
        from_attributes=True


class Payload(BaseModel):
    exp:int
    sub:str
    class Config:
        from_attributes=True
