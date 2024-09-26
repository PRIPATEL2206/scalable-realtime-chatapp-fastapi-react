const BASE= import.meta.env.VITE_API_BASE_URL

const API_ROUTES = {
    LOGIN:BASE+"/auth/login",
    REGISTER:BASE+"/auth/register",
    REFRESH_TOCKEN:BASE+"auth/refresh-token",
    GET_USERS:BASE+"/auth/users",
    UPDATE_USER:BASE+"/auth/user",

    GET_MY_GROUP:BASE+"/chats/get-my-groups",
    GET_ALl_GROUP:BASE+"/chats/get-all-groups",
    CREATE_GROUP:BASE+"/chats/group",
    GROUP_ADD_USER:BASE+"/chats/add-in-group",
    GROUP_DELETE_USER:BASE+"/chats/delete-from-group",
    GROUP_ADD_REQ:BASE+"/chats/add-group-req",
    UPDATE_GROUP:BASE+"/chats/group",

    GET_CHATS:(group_id:string)=>BASE+"/chats/get-chats?group_id="+group_id,
    GET_GROUP_USERS:(groupId:string)=>BASE+"/chats/get-group-user?group_id="+groupId,

}

export { API_ROUTES }