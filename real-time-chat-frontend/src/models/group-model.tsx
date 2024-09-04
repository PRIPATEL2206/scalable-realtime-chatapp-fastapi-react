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
        last_updated,
        created_at,
        created_by,
        des,
        is_individual_group = false
    }: {
        id: string,
        name: string,
        last_updated: string,
        created_at: string,
        created_by: string,
        des: string,
        is_individual_group: boolean
    }
    ) {
        this.id = id
        this.name = name
        this.last_updated = last_updated
        this.created_at = created_at
        this.created_by = created_by
        this.des = des
        this.is_individual_group = is_individual_group
    }

    toJson = () => ({
        id: this.id,
        name: this.name,
        last_updated: this.last_updated,
        created_at: this.created_at,
        created_by: this.created_by,
        des: this.des,
        is_individual_group: this.is_individual_group
    })
}

export { Group }