from fastapi  import WebSocket
from chat_websockets.db_models import Group,Chat
from chat_websockets.response_models import Res_Chat
from db.base_db import get_db
from chat_websockets.constants import Events
from auth.response_models import Response_User
from auth.db_models import User

import json

class UserSocketManager:
    def __init__(self) -> None:
        self.users:dict[str,WebSocket]={}
    
    async def connect(self,user_id:str,websocket:WebSocket):
        if not self.users.get(user_id,False):
            print(f"user with {user_id} already conected is now disconected and again conected")

        self.users[user_id]=websocket

    async def disconnect(self,user_id:str):
        assert self.users.get(user_id,False) , f"user with {user_id} not found"
        await self.users[user_id].close()
        del self.users[user_id]

    async def send_personal_msg(self,user_id:str,msg:str):
        if self.users.get(user_id,False):
            await self.users[user_id].send_text(msg)
    
    async def broadcast_all_in_group(self,sender:User,group_id:str,msg:str)->bool:
        db = next(get_db())
        group = db.query(Group).filter(Group.id == group_id).first()
        if group :
            if group.has_user(sender.id):
                for user in group.users:
                    await self.send_personal_msg(user.id,msg)
                return True
        
        await self.send_personal_msg(sender.id,MassageBuilder.build_unauthorized_event(f"user not have access to send massage in this group"))
        return False
    
    async def send_group_connect_req(self,user_id:str,user:User,group:Group):
        db = next(get_db())
        con_req = Chat(
            sender_id=user_id,
            group_id=group.id,
            is_conection_req=True,
            is_any_event=True,
            msg=json.dumps(Response_User.model_validate(user).model_dump_json())
            )
        con_req.add(db)
        msg=Res_Chat.model_validate(con_req)
        for user in group.users:
            await self.send_personal_msg(user.id,MassageBuilder.build_group_connect_req_event(msg.model_dump_json()))
        return msg.model_dump_json()

class UserSocketHelper:
    def __init__(self,userScocketManager:UserSocketManager,user:User,websocket:WebSocket) -> None:
        self.userScocketManager=userScocketManager
        self.user=user
        self.websocket=websocket

    
    async def connect(self):
       await self.userScocketManager.connect(self.user.id,self.websocket)

    async def disconnect(self):
        await self.userScocketManager.disconnect(self.user.id)

    async def send_personal_msg(self,msg:str):
        await self.userScocketManager.send_personal_msg(self.user.id,msg)

    async def broadcast_all_in_group(self,group_id:str,msg:str)->bool:
        return await self.userScocketManager.broadcast_all_in_group(self.user,group_id,msg)


# def build_msg(sender:str="",msg:str="",event_type:str="new_massage"):
#     return str({
#         "sender":sender,
#         "msg":msg,
#         "event_type":event_type
#     })

class MassageBuilder:

    def build(event:str,msg:any):
        return json.dumps({
            "event":event,
            "data":msg
        })

    def build_massage_recive_event(msg:any)->str:
        return MassageBuilder.build(
            Events.MASSAGE_RECIVE,
            {
                "chat":msg
            }
        )
    
    def build_massage_send_event(msg:any)->str:
        return MassageBuilder.build(
            Events.MASSAGE_SEND,
            {
                "chat":msg
            }
        )
        
    def build_group_connect_req_event(msg:any)->str:
        return MassageBuilder.build(
            Events.GROUP_JOIN_REQ,
            {
                "chat":msg
            }
        )
    
    def build_group_add_event(msg:any)->str:
        return MassageBuilder.build(
            Events.GROUP_USER_ADD,
            {
                "chat":msg
            }
        )
    def build_group_delete_event(msg:any)->str:
        return MassageBuilder.build(
            Events.GROUP_USER_DELETE,
            {
                "chat":msg
            }
        )
    
    def build_unauthorized_event(msg:any)->str:
        return MassageBuilder.build(
            Events.UNAUTHORIZED,
            {
                "msg":msg
            }
        )
    
    def build_error_event(msg:any)->str:
        return MassageBuilder.build(
            Events.ERROR,
           {
                "msg":msg
            }
        )
    
    