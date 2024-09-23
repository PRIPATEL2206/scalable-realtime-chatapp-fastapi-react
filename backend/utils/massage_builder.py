from chat_websockets.constants import Events
import json

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
    
    def build_new_group_add_event(msg:any)->str:
        return MassageBuilder.build(
            Events.NEW_GROUP_ADD,
            {
                "group":msg
            }
        )
    def build_group_user_delete_event(msg:any)->str:
        return MassageBuilder.build(
            Events.GROUP_USER_DELETE,
            {
                "chat":msg
            }
        )
    def build_group_remove_event(msg:any)->str:
        return MassageBuilder.build(
            Events.GROUP_REMOVE,
            {
                "group":msg
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
    
   