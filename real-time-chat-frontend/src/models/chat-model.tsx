class Chat {
    id: string
    msg: string
    group_id: string
    created_at: string
    sender_id: string
    is_conection_req: boolean
    is_any_event:boolean

    constructor({
        id,
        msg,
        group_id,
        created_at,
        sender_id,
        is_conection_req = false,
        is_any_event = false
    }: {
        id: string,
        msg: string,
        group_id: string,
        created_at: string,
        sender_id: string,
        is_conection_req: boolean
        is_any_event: boolean
    }
    ) {
        this.id = id;
        this.msg = msg;
        this.group_id = group_id
        this.created_at = created_at
        this.sender_id = sender_id
        this.is_conection_req = is_conection_req
        this.is_any_event = is_any_event
    }

    toJson = () => ({
        id: this.id,
        msg: this.msg,
        group_id: this.group_id,
        created_at: this.created_at,
        sender_id: this.sender_id,
        is_conection_req: this.is_conection_req,
        is_any_event: this.is_any_event
    })
}

export { Chat }