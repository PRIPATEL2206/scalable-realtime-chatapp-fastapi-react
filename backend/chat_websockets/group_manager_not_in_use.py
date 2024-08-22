from fastapi import WebSocket


class GroupManager:
    def __init__(self) -> None:
        self.sockets:list[WebSocket]=[] 

    async def connect(self,websocket:WebSocket):
        await websocket.accept()
        self.sockets.append(websocket)

    async def disconnect(self,websocket:WebSocket):
        await websocket.close()
        self.sockets.remove(websocket)
    
    async def send_personal_msg(self,websocket:WebSocket,msg:str):
        await websocket.send_text(msg)
    
    async def broadcast_all(self,msg:str):
        for socket in self.sockets:
            await socket.send_text(msg)
    
    async def broadcast(self,websocket:WebSocket,msg:str):
        for socket in self.sockets:
            if websocket==socket:
                continue 
            await socket.send_text(msg)


class WebSocketManager:
    def __init__(self) -> None:
        self.groups:dict[str,GroupManager]={}
    
    async def connect(self,group:str,websocket:WebSocket):
        if not self.groups.get(group,False):
            self.groups[group]=GroupManager()

        await self.groups[group].connect(websocket)

    async def disconnect(self,group:str,websocket:WebSocket):
        assert self.groups.get(group,False) , f"group {group} not found"
        await self.groups[group].disconnect(websocket)
    
    async def send_personal_msg(self,websocket:WebSocket,msg:str):
        await websocket.send_text(msg)
    
    async def broadcast_all(self,group:str,msg:str):
        assert self.groups.get(group,False) , f"group {group} not found"
        await self.groups[group].broadcast_all(msg)
    
    async def broadcast(self,group:str,websocket:WebSocket,msg:str):
        assert self.groups.get(group,False) , f"group {group} not found"
        await self.groups[group].broadcast(websocket,msg)


class SocketHelper:
    def __init__(self,socketManager:WebSocketManager,group,webSocket:WebSocket) -> None:
        self.websocketManager:WebSocketManager=socketManager
        self.group:str=group
        self.websocket:WebSocket=webSocket

        
    async def connect(self):
        await self.websocketManager.connect(self.group,self.websocket)
        
    async def disconnect(self):
        await self.websocketManager.disconnect(self.group,self.websocket)
    
    async def send_personal_msg(self,msg:str):
        await self.websocketManager.send_personal_msg(self.websocket,msg)
    
    async def broadcast_all(self,msg:str):
       await self.websocketManager.broadcast_all(self.group,msg)
    
    async def broadcast(self,msg:str):
        await self.websocketManager.broadcast(self.group,self.websocket,msg)

    # def __delattr__(self, name: str) -> None:
    #     self.disconnect()


def build_msg(sender:str="",msg:str="",event_type:str="new_massage"):
    return str({
        "sender":sender,
        "msg":msg,
        "event_type":event_type
    })