class User {
    id: string
    name: string
    email: string
    access_token: string
    refresh_token: string
    constructor({
        id,
        name,
        email,
        access_token,
        refresh_token
    }: {
        id: string,
        name: string,
        email: string,
        access_token: string,
        refresh_token: string
    }
    ) {
        this.id = id;
        this.name = name;
        this.email = email
        this.access_token = access_token
        this.refresh_token = refresh_token
    }
}

export {User}