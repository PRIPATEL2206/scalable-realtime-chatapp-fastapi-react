from fastapi import FastAPI,WebSocketDisconnect,WebSocket
from group_manager import SocketHelper,WebSocketManager
app= FastAPI()

@app.get("/")
def home():
    return {"data":"ok1"}

webSocketManager = WebSocketManager()

@app.websocket("/ws/{client_id}/{group_id}")
async def websocket_endpoint(websocket:WebSocket,client_id:str,group_id:str):

    socketHelper=SocketHelper(webSocketManager,group_id,websocket)
    await socketHelper.connect()

    # await socketHelper.send_personal_msg(f"{client_id} connected")
    await socketHelper.broadcast_all(f"{client_id} joined {group_id} !!")
    try:
        while True:
            data = await websocket.receive_text()
            await socketHelper.broadcast(f"{client_id} :  {data}")

    except WebSocketDisconnect:
        await socketHelper.disconnect()

