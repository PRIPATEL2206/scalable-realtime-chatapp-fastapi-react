from fastapi  import WebSocket
from chat_websockets.db_models import Group
from db.base_db import get_db
from auth.db_models import User

class UserSocketManager:
    def __init__(self) -> None:
        self.users:dict[str,WebSocket]={}
    
    async def connect(self,user_id:str,websocket:WebSocket):
        if not self.users.get(user_id,False):
            print(f"user with {user_id} already conected is now disconected and again conected")

        self.users[user_id]=websocket

        await self.users[user_id].accept()

    async def disconnect(self,user_id:str,websocket:WebSocket):
        assert self.users.get(user_id,False) , f"user with {user_id} not found"
        del self.users[user_id]

    async def send_personal_msg(self,user_id:str,msg:str):
        if self.users.get(user_id,False):
            await self.users[user_id].send_text(msg)
    
    async def broadcast_all_in_group(self,group_id:str,msg:str):
        db = next(get_db())
        group = db.query(Group).filter(Group.id == group_id).first()
        if group:
            for user in group.users:
                await self.send_personal_msg(user.id,msg)
            # assert self.groups.get(group,False) , f"group {group} not found"
            # await self.groups[group].broadcast_all(msg)
    
    # async def broadcast(self,group:str,websocket:WebSocket,msg:str):
    #     assert self.groups.get(group,False) , f"group {group} not found"
    #     await self.groups[group].broadcast(websocket,msg)


class UserSocketHelper:
    def __init__(self,userScocketManager:UserSocketManager,user:User,websocket:WebSocket) -> None:
        self.userScocketManager=userScocketManager
        self.user=user
        self.websocket=websocket

    
    async def connect(self):
       await self.userScocketManager.connect(self.user.id,self.websocket)

    async def disconnect(self):
        await self.userScocketManager.disconnect()

    async def send_personal_msg(self,msg:str):
        await self.userScocketManager.send_personal_msg(self.user.id,msg)

    async def broadcast_all_in_group(self,group_id:str,msg:str):
        await self.userScocketManager.broadcast_all_in_group(group_id,msg)
            # assert self.groups.get(group,False) , f"group {group} not found"
            # await self.groups[group].broadcast_all(msg)
    
    # async def broadcast(self,group:str,websocket:WebSocket,msg:str):
    #     assert self.groups.get(group,False) , f"group {group} not found"
    #     await self.groups[group].broadcast(websocket,msg)



def build_msg(sender:str="",msg:str="",event_type:str="new_massage"):
    return str({
        "sender":sender,
        "msg":msg,
        "event_type":event_type
    })