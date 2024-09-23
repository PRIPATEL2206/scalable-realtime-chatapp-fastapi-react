import { User } from "./user-model"

class Chat {
    id: string
    msg: string
    groupId: string
    createdAt: Date
    senderId: string
    isConectionReq: boolean
    isAnyEvent: boolean
    conReqSender?: User


    constructor({
        id,
        msg,
        group_id,
        created_at,
        sender_id,
        is_conection_req = false,
        is_any_event = false,
        con_req_sender
    }: {
        id: string,
        msg: string,
        group_id: string,
        created_at: string,
        sender_id: string,
        is_conection_req?: boolean
        is_any_event?: boolean
        con_req_sender?: User
    }
    ) {
        this.id = id;
        this.msg = msg;
        this.groupId = group_id
        this.createdAt = new Date(created_at)
        this.senderId = sender_id
        this.isConectionReq = is_conection_req
        this.isAnyEvent = is_any_event
        this.conReqSender = con_req_sender
    }

    toJson = () => ({
        id: this.id,
        msg: this.msg,
        group_id: this.groupId,
        created_at: this.createdAt.toString(),
        sender_id: this.senderId,
        is_conection_req: this.isConectionReq,
        is_any_event: this.isAnyEvent,
        con_req_sender: this.conReqSender

    })
}

export { Chat }