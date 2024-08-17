
from fastapi import APIRouter,WebSocketDisconnect,WebSocket,Depends,HTTPException,status
from chat_websockets.group_manager  import SocketHelper,WebSocketManager,build_msg
from auth.dependency import get_curent_user_from_tocken
from db.base_db import get_db


router = APIRouter(
    prefix="/ws/chats",
 tags=["chats_websocket"],
)

webSocketManager = WebSocketManager()

@router.websocket("/{group_id}")
async def websocket_endpoint(websocket:WebSocket,group_id:str):
    try :
        token=websocket.headers.get("authorization")
        user = await get_curent_user_from_tocken(token=token)
    except :
        raise  HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    socketHelper=SocketHelper(webSocketManager,group_id,websocket)
    await socketHelper.connect()

    await socketHelper.broadcast_all(build_msg("server",f"{user.id} joined {group_id}","server_event"))
    try:
        while True:
            data = await websocket.receive_text()
            await socketHelper.broadcast(build_msg(user.id,data))

    except WebSocketDisconnect:
        await socketHelper.disconnect()


