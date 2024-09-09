from db.base_db import CustomBaseDB,Base
from sqlalchemy import Column,ForeignKey,String,Table,Boolean
from sqlalchemy.orm import relationship

class Chat(CustomBaseDB,Base):
    __tablename__="chats"
    
    sender_id=Column(String(20),ForeignKey("users.id"))
    group_id=Column(String(20),ForeignKey("groups.id"))
    is_conection_req=Column(Boolean,default=False)
    is_any_event:bool=Column(Boolean,default=False)
    msg=Column(String())


users_groups=Table("users_groups",Base.metadata,
                   Column("user_id",ForeignKey("users.id"),primary_key=True),
                   Column("group_id",ForeignKey("groups.id"),primary_key=True)
                   )

class Group(CustomBaseDB,Base):
    __tablename__="groups"
    
    name=Column(String(20))
    des=Column(String(50))
    is_individual_group=Column(Boolean,default=False)
    created_by=Column(String(20),ForeignKey("users.id"))
    users=relationship("User",secondary=users_groups,back_populates="groups")

    def has_user(self,user_id:str)->bool:
        return user_id in [user.id for user in self.users ]