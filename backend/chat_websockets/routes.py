
from fastapi import APIRouter,WebSocketDisconnect,WebSocket,Depends,HTTPException,status,Body
from fastapi.responses import StreamingResponse
from chat_websockets.user_massage_manager  import UserSocketManager, MassageBuilder,UserSocketHelper
from auth.dependency import get_curent_user_from_tocken,get_current_user
from db.base_db import get_db
from chat_websockets.request_models import Req_Chat,Req_Group,AddDeleteUserGroupReq
from chat_websockets.response_models import Res_Group,Res_Chat
from chat_websockets.db_models import Group,Chat
from auth.db_models import User
from auth.response_models import Response_User
from sqlalchemy.orm import Session
from chat_websockets.constants import Events
from utils.genratore_util import get_genratore
import json
import datetime


router = APIRouter(
    prefix="/chats",
 tags=["chats_websocket"],
)

userSocketManager = UserSocketManager()

@router.post("/group")
async def create_group(req_group:Req_Group,user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    if req_group.is_individual_group:
        group_name=req_group.name
        print(group_name)
        rev_group_name=":".join(group_name.split(":")[::-1])
        print(rev_group_name)
        pre_group=db.query(Group).filter(Group.name==group_name).first() or db.query(Group).filter(Group.name==rev_group_name).first()
        print(pre_group)
        if pre_group:
            raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="chats with user already exist"
            )
        
    group=Group(**req_group.model_dump())
    group.users=[user]
    group.created_by = user.id
    group.add(db)
    return Res_Group.model_validate(group)

@router.post("/add-group-req")
async def send_group_add_request(group_id:str,user:User=Depends(get_current_user),db:Session=Depends(get_db)):
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

@router.post("/add-in-group")
async def add_in_group(add_in_group:AddDeleteUserGroupReq,user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    group:Group = db.query(Group).get(add_in_group.group_id)

    if group.created_by != user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="only admin can add users"
        )
    
    if group.is_individual_group and len(group.users)>1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="only two user are allowd in individual group"
        )

    user_to_add:User = db.query(User).get(add_in_group.user_id)
    if not group:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="group not found"
        )

    if not user_to_add:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"user to add not found"
        )
    
    if group.has_user(user_to_add.id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"user already in group"
        )
    
    
    group.users.append(user_to_add)
    group.update(db)
    if not group.is_individual_group:

        chat = Chat(
            sender_id=user.id,
            group_id=add_in_group.group_id,
            is_conection_req=True,
            msg=f"{user.name} added {user_to_add.name}"
            )
        chat.add(db)
        chat_res=Res_Chat.model_validate(chat)
        await userSocketManager.broadcast_all_in_group(user,chat.group_id,MassageBuilder.build_group_add_event(chat_res.model_dump_json()))

    return {"event":"user added"}

@router.post("/delete-from-group")
async def delete_from_group(delete_from_group:AddDeleteUserGroupReq,user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    group:Group = db.query(Group).get(delete_from_group.group_id)
    if not group:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="group not found"
        )
    if group.created_by != user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="only admin can delete users"
        )
    if group.created_by == delete_from_group.user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="admin can't delete from group"
        )
    
    if group.is_individual_group :
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="user deletion is not allowed in individual group"
        )

    user_to_delete:User = db.query(User).get(delete_from_group.user_id)
    

    if not user_to_delete:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"user to delete not found"
        )
    
    if not group.has_user(user_to_delete.id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"user not in group in group"
        )
    
    group.users.remove(user_to_delete)
    group.update(db)
    if not group.is_individual_group:

        chat = Chat(
            sender_id=user.id,
            group_id=delete_from_group.group_id,
            is_conection_req=True,
            msg=f"{user.name} removed {user_to_delete.name}"
            )
        chat.add(db)
        chat_res=Res_Chat.model_validate(chat)
        await userSocketManager.broadcast_all_in_group(user,chat.group_id,MassageBuilder.build_group_add_event(chat_res.model_dump_json()))

    return {"event":"user deleted"}



@router.get("/get-my-groups")
async def get_users_groups(user:User=Depends(get_current_user)):
    return StreamingResponse(
        content=get_genratore(map(
                lambda group:Res_Group.model_validate(group).model_dump_json(),
               sorted(user.groups,key=lambda group:group.last_updated,reverse=True) 
                )),
        media_type="text/event-stream")

@router.get("/get-all-groups")
async def get_all_groups(db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    return StreamingResponse(
        content=get_genratore(map(
                lambda group:Res_Group.model_validate(group).model_dump_json(),
               sorted(db.query(Group).filter(Group.is_individual_group!=True).all(),key=lambda group:group.name,reverse=True) 
                )),
        media_type="text/event-stream")


@router.get('/get-group-user')
def get_users(group_id:str,user:User=Depends(get_current_user), db:Session=Depends(get_db)):
        group:Group = db.query(Group).get(group_id)
        if not group or (group_id not in [group.id for group in user.groups]):
            raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="group not found"
        )
        return StreamingResponse(
            content=get_genratore(map(
                         lambda user:Response_User.model_validate(user).model_dump_json(),  
                            group.users
                    )),
            media_type="text/event-stream")
    

@router.get("/get-chats")
async def get_chats_of_group(group_id:str,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
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
                            group.last_updated=datetime.datetime.now(datetime.UTC)
                            group.update(db)
                            chat_res=Res_Chat.model_validate(chat)
                            await socketHelper.send_personal_msg(MassageBuilder.build_massage_send_event(chat_res.model_dump_json()))
                            await socketHelper.broadcast_all_in_group(chat.group_id,MassageBuilder.build_massage_recive_event(chat_res.model_dump_json())) 
                        else:
                            await socketHelper.send_personal_msg(MassageBuilder.build_error_event({"error":"error while sending massage"}))

                    
            except Exception as e:
                    if type(e) == WebSocketDisconnect:
                        raise WebSocketDisconnect()
                    await websocket.send_text(MassageBuilder.build_error_event(f'error:{e}'))
                    print(e)

    except WebSocketDisconnect :
        if socketHelper:
            await socketHelper.disconnect()

