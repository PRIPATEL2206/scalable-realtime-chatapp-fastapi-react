class Group {
    id: string
    name: string
    lastUpdated: Date
    createdAt: Date
    createdBy: string
    des: string
    isIndividualGroup: boolean
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
        this.lastUpdated = new Date(last_updated)
        this.createdAt = new Date(created_at)
        this.createdBy = created_by
        this.des = des
        this.isIndividualGroup = is_individual_group
    }

    toJson = () => ({
        id: this.id,
        name: this.name,
        last_updated: this.lastUpdated,
        created_at: this.createdAt.toString(),
        created_by: this.createdBy.toString(),
        des: this.des,
        is_individual_group: this.isIndividualGroup
    })
}

export { Group }