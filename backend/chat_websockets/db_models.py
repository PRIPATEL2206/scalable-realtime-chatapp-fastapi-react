from db.base_db import CustomBaseDB,Base
from sqlalchemy import Column,ForeignKey,String,Table
from sqlalchemy.orm import relationship

class Chat(CustomBaseDB,Base):
    __tablename__="chats"
    
    sender_id=Column(String(20),ForeignKey("users.id"))
    group_id=Column(String(20),ForeignKey("groups.id"))
    msg=Column(String())


users_groups=Table("users_groups",Base.metadata,
                   Column("user_id",ForeignKey("users.id"),primary_key=True),
                   Column("group_id",ForeignKey("groups.id"),primary_key=True)
                   )

class Group(CustomBaseDB,Base):
    __tablename__="groups"
    
    name=Column(String(20))
    des=Column(String(50))
    created_by=Column(String(20),ForeignKey("users.id"))
    users=relationship("User",secondary=users_groups,back_populates="groups")