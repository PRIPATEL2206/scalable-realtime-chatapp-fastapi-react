from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from db.base_db import Base,CustomBaseDB
from chat_websockets.db_models import users_groups

class User(CustomBaseDB,Base):
    __tablename__="users"

    name=Column(String(50),default="")
    email=Column(String(50), unique=True)
    password=Column(String(100))
    groups=relationship("Group",secondary=users_groups,back_populates="users")

