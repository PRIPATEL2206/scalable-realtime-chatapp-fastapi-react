from pydantic import BaseModel
from datetime import datetime

class Res_anser(BaseModel):
    msg:str
    created_at:datetime

    class Config:
        from_attributes=True