from sqlalchemy import Column, String
from db.base_db import Base,CustomBaseDB

class User(CustomBaseDB,Base):
    __tablename__="users"

    name=Column(String(50),default="")
    email=Column(String(50), unique=True)
    password=Column(String())

