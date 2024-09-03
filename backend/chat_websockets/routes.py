
from fastapi import APIRouter,WebSocketDisconnect,WebSocket,Depends,HTTPException,status
from fastapi.responses import StreamingResponse
from chat_websockets.user_massage_manager  import UserSocketManager, MassageBuilder,UserSocketHelper
from auth.dependency import get_curent_user_from_tocken,get_current_user
from db.base_db import get_db
from chat_websockets.request_models import Req_Chat,Req_Group
from chat_websockets.response_models import Res_Group,Res_Chat
from chat_websockets.db_models import Group,Chat
from auth.db_models import User
from sqlalchemy.orm import Session
from chat_websockets.constants import Events
from utils.genratore_util import get_genratore
import json


router = APIRouter(
    prefix="/chats",
 tags=["chats_websocket"],
)

userSocketManager = UserSocketManager()

@router.post("/group")
async def create_group(req_group:Req_Group,user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    group=Group(**req_group.model_dump())
    group.users=[user]
    group.created_by = user.id
    group.add(db)
    return Res_Group.model_validate(group)

@router.post("/add-group-req")
async def add_in_group(group_id:str,user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    group = db.query(Group).filter(Group.id==group_id).first()
    if not group:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"group not found with id {group_id}"
        )
    if user in group.users :
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"user Already in Group"
        )

    return await userSocketManager.send_group_connect_req(user.id,group)


@router.get("/groups")
async def get_all_groups(db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    return StreamingResponse(
        content=get_genratore(map(
                lambda group:Res_Group.model_validate(group).model_dump_json(),
               user.groups 
                )),
        media_type="text/event-stream")


@router.get("/get-chats")
async def get_all_chats(group_id:str,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    group=db.query(Group).filter(Group.id==group_id).first()
    if not group:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"group not found with id {group_id}"
        )
    if not group.has_user(user_id=user.id) :
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"user not in group"
        )
    return StreamingResponse(
        content=get_genratore(map(
                lambda chat:Res_Chat.model_validate(chat).model_dump_json(),
                db.query(Chat).filter(Chat.group_id==group_id).order_by(Chat.created_at).all()
                )),
        media_type="text/event-stream"
            )




# {"event":"massage_send",
#  "data":{
#      "group_id":"649b194b-1d62-4198-91bf-100bfc2ab481",
#      "msg":"ok"
#  }
#  }

# localhost:8000/ws/chats

# Authorization

# @router.websocket("/ws")
# async def test(websocket:WebSocket):
#     await websocket.accept()
#     while True:
#         data= await websocket.receive_text() 
#         print(data)

@router.websocket("/ws")
async def websocket_endpoint(websocket:WebSocket,db:Session=Depends(get_db)):
    await websocket.accept()
    socketHelper:UserSocketHelper = None
    user:User = None

    try:
        while True:
            try :
                data:dict = json.loads( await websocket.receive_text())
                print(data)
                event=data["event"]
                data=data["data"]

                match event :

                    case Events.AUTHORIZATION:
                        token=data["Authorization"]
                        print(token)
                        user = await get_curent_user_from_tocken(token=token)
                        socketHelper = UserSocketHelper(userSocketManager,user,websocket)
                        await socketHelper.connect()

                    case Events.MASSAGE_SEND:
                        req_chat=Req_Chat(**data)
                        group = db.query(Group).filter(Group.id == req_chat.group_id).first()
                        if group and group.has_user(user.id) :
                            chat=Chat(**req_chat.model_dump())
                            chat.sender_id=user.id
                            chat.add(db)
                            chat_res=Res_Chat.model_validate(chat)
                            await socketHelper.send_personal_msg(MassageBuilder.build_massage_send_event(chat_res.model_dump_json()))
                            await socketHelper.broadcast_all_in_group(chat.group_id,MassageBuilder.build_massage_recive_event(chat_res.model_dump_json())) 
                        else:
                            await socketHelper.send_personal_msg(MassageBuilder.build_error_event({"error":"error while sending massage"}))

                    case Events.GROUP_ADD:
                        group = db.query(Group).filter(Group.id==data["group_id"]).first()
                        user_to_add:User = db.query(User).filter(User.id==data["user_id"]).first()

                        if not group:
                            raise Exception("group not found")
                        if not user_to_add:
                            raise Exception("user not found")
                        
                        if user_to_add in group.users:
                            raise Exception("user already in group")
                        
                        chat = Chat(
                            sender_id=user.id,
                            group_id=data["group_id"],
                            is_conection_req=True,
                            msg=f"{user.name} added {data.get('user_name',data['user_id'])}"
                            )
                        chat.add(db)

                        group.users.append(user_to_add)
                        group.update(db)

                        await socketHelper.broadcast_all_in_group(chat.group_id,MassageBuilder.build_group_add_event(chat_res))

            except Exception as e:
                    if type(e) == WebSocketDisconnect:
                        raise WebSocketDisconnect()
                    await websocket.send_text(MassageBuilder.build_error_event(f'error:{e}'))
                    print(e)

    except WebSocketDisconnect :
        if socketHelper:
            await socketHelper.disconnect()

