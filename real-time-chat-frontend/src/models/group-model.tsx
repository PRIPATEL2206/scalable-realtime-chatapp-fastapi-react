class Group {
    id: string
    name: string
    last_updated: string
    created_at: string
    created_by: string
    des: string
    is_individual_group: boolean
    constructor({
        id,
        name,
        email,
        access_token,
        refresh_token,
        des,
        is_individual_group = false
    }: {
        id: string,
        name: string,
        email: string,
        access_token: string,
        refresh_token: string,
        des:string,
        is_individual_group:boolean
    }
    ) {
        this.id = id;
        this.name = name;
        this.last_updated = email
        this.created_at = access_token
        this.created_by = refresh_token
        this.des=des,
        this.is_individual_group=is_individual_group
    }

    toJson =() =>({
        id:this.id,
        name:this.name,
        email:this.last_updated,
        access_token:this.created_at,
        refresh_token:this.created_by,
        des:this.des,
        is_individual_group:this.is_individual_group
    })
}

export {Group}