
from pydantic import BaseModel
from typing import Optional

class Request_User(BaseModel):
    email:str
    password:str
    
class Response_User(BaseModel):
    id:Optional[str]
    email:str
    password:str

class TokenSchema(BaseModel):
    access_token:str
    refresh_token:str

class Payload(BaseModel):
    exp:int
    sub:str