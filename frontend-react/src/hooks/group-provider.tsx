import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Group } from '../models/group-model';
import { Chat } from '../models/chat-model';
import { User } from '../models/user-model';
import { streamDataFromReader } from '../utils/stream-data';
import { tost } from './tost-provider';
import CustomError from '../models/error-model';

interface GroupContextInterface {
  groups: Group[]
  curentGroup?: Group
  setCurentGroup: (group: Group) => void
  createGroup: ({ groupName, des, isIndividual }: { groupName: string, des: string, isIndividual?: boolean }) => Promise<Group>
  fetchAllGroups: ({ onGroup, onStart }: { onGroup: (group: Group) => void, onStart?: () => void }) => Promise<void>

  chats: Chat[]
  sendMassage: (msg: string) => void

  addUser: (userId: string, groupId?: string) => Promise<void>
  deleteUser: (userId: string, groupId?: string) => Promise<void>
  sendGroupAddReq: (groupId: string) => Promise<void>
  allUsers: { [userid: string]: User }
  curentGroupUsers: { [userid: string]: User }
  fetchUsers: ({ onUser, onDataStart, uIds }: { onUser?: (user: User) => void, onDataStart?: () => void, uIds?: string[] }) => Promise<void>
}
const GroupContext = createContext<GroupContextInterface | undefined>(undefined);

const useGroup = () => {
  const context = useContext(GroupContext);
  if (context === undefined) {
    throw new Error("useAuth must most be use with in a AuthProvider");
  }
  return context;
}

let sendMassage: (msg: string) => void;

interface GroupPropsInterface {
  children: ReactNode,
  user: User,
  onError: (e: CustomError) => void,
  ws?: WebSocket

}
const GroupProvider: React.FC<GroupPropsInterface> = ({ children, user, onError, ws }) => {

  const [groups, setGroups] = useState<Group[]>([]);
  const [curentGroup, setCurentGroup] = useState<Group>();
  const [chats, setChats] = useState<Chat[]>([]);
  const [allUsers, setAllUsers] = useState<{ [uid: string]: User }>({});
  const [curentGroupUsers, setCurentGroupUsers] = useState<{ [uid: string]: User }>({});


  // group manupulation functions

  const fetchGroups = async () => {

    try {
      const response = await fetch("http://127.0.0.1:8000/chats/get-my-groups", {
        method: "get",
        headers: {
          accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Bearer ${user?.access_token}`
        },
      });

      if (response.status !== 200) {
        const error = await response.json()
        onError(new CustomError({
          error: JSON.stringify(error),
          statusCode: response.status
        }))
      }
      setGroups(_g => [])
      const inividualChatsUsers: string[] = []
      streamDataFromReader(
        {
          reader: response.body!.getReader(),
          onData: (data) => {
            const group = new Group(JSON.parse(data))
            if (group.isIndividualGroup) {
              const users = group.name.split(":");
              group.name = users[0] === user.id ? users[1] : users[0]
              inividualChatsUsers.push(group.name)
            }
            setGroups(groups => [...groups, group])
          },

        }
        ,)
      fetchUsers({ uIds: inividualChatsUsers })
    }
    catch (e: any) {
      console.log(e)
      onError(new CustomError({
        error: JSON.stringify(e)
      }));
    }

  }

  const fetchAllGroups = async ({ onGroup, onStart }: { onGroup: (group: Group) => void, onStart?: () => void }) => {

    try {
      const response = await fetch("http://127.0.0.1:8000/chats/get-all-groups", {
        method: "get",
        headers: {
          accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Bearer ${user?.access_token}`
        },
      });

      if (response.status !== 200) {
        const error = await response.json()
        console.log(error)
        onError(new CustomError({
          error: JSON.stringify(error),
          statusCode: response.status
        }))
      }
      if (onStart) {
        onStart()
      }
      streamDataFromReader(
        {
          reader: response.body!.getReader(),
          onData: (data) => {
            const group = new Group(JSON.parse(data))
            onGroup(group);
          },

        }
        ,)
    }
    catch (e: any) {
      console.log(e)
      onError(new CustomError({
        error: JSON.stringify(e)
      }));
    }

  }

  const createGroup = async ({ groupName, des, isIndividual = false }: { groupName: string, des: string, isIndividual?: boolean }) => {
    const response = await fetch("http://127.0.0.1:8000/chats/group", {
      method: "post",
      headers: {
        accept: "application/json",
        'Authorization': `Bearer ${user.access_token}`,
        'Content-Type': "application/json"
      },
      body: JSON.stringify({
        name: groupName,
        is_individual_group: isIndividual,
        des: des
      })
    });
    if (response.status !== 200) {
      onError(new CustomError({
        error: JSON.stringify(await response.json()),
        statusCode: response.status
      }))
    }
    const data = await response.json()
    const newGroup = new Group({ ...data });

    if (newGroup.isIndividualGroup) {
      const users = newGroup.name.split(":");
      newGroup.name = users[0] === user.id ? users[1] : users[0]
    }
    setGroups(groups => [newGroup, ...groups])
    tost.sucsess(`${newGroup.name} is created sucsessfuly`)
    return newGroup
  }


  // massage manupulation functions 

  sendMassage = (msg: string) => {
    if (curentGroup) {
      ws?.send(JSON.stringify({
        "event": "massage_send",
        "data": {
          "group_id": curentGroup.id,
          "msg": msg
        }
      }));
    }
  }

  let handleMassage = async (chat: Chat, event: string) => {
    console.log(event)

    if (event === "group_join_req") {
      chat.conReqSender = new User(JSON.parse(JSON.parse(chat.msg)))
    }

    if (event !== "massage_send") {
      if (curentGroup?.id === chat.groupId) {
        setChats(chats => [...chats, chat]);
      }
      setGroups(groups => {
        const index = groups.map(groups => groups.id).indexOf(chat.groupId)
        return [groups[index], ...groups.slice(0, index), ...groups.slice(index + 1, groups.length)]
      })
    }
  }

  const fetchChats = async (groupId: string) => {

    try {
      const response = await fetch(`http://127.0.0.1:8000/chats/get-chats?group_id=${groupId}`, {
        method: "get",
        headers: {
          accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Bearer ${user?.access_token}`
        },
      });

      if (response.status !== 200) {
        const error = await response.json()
        console.log(error)
        onError(new CustomError({
          error: JSON.stringify(error),
          statusCode: response.status
        }))
      }
      setChats(_c => [])
      streamDataFromReader({
        reader: response.body!.getReader(),
        onData: (data) => {
          const chat = new Chat(JSON.parse(data))
          if (chat.isConectionReq) {
            chat.conReqSender = new User(JSON.parse(JSON.parse(chat.msg)))
          }
          setChats(chats => [...chats, chat])
        }
      }
      );
    }
    catch (e: any) {
      console.log(e)
      onError(new CustomError({
        error: JSON.stringify(e),
      }));
    }

  }


  // user manupulation functions

  const fetchUsers = async ({ onUser, onDataStart, uIds }: { onUser?: (user: User) => void, onDataStart?: () => void, uIds?: string[] }) => {

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/users", {
        method: "post",
        headers: {
          accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Bearer ${user?.access_token}`
        },
        body: uIds?.toString()
      });

      if (response.status !== 200) {
        const error = await response.json()
        onError(new CustomError({
          error: JSON.stringify(error),
          statusCode: response.status
        }))
      }
      if (onDataStart) {
        onDataStart()
      }
      await streamDataFromReader(
        {
          reader: response.body!.getReader(),
          onData: (data) => {
            const user = new User(JSON.parse(data));
            setAllUsers(users => ({ ...users, ...{ [user.id]: user } }));
            if (onUser) {
              onUser(user)
            }
          },

        }
        ,)
    }
    catch (e: any) {
      console.log(e)
      onError(new CustomError({
        error: JSON.stringify(e)
      }))
    }

  }

  const fetchUsersOfGroup = async (groupId: string) => {

    try {
      const response = await fetch(`http://localhost:8000/chats/get-group-user?group_id=${groupId}`, {
        method: "get",
        headers: {
          accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Bearer ${user?.access_token}`
        },
      });

      if (response.status !== 200) {
        const error = await response.json()
        console.log(error)

        onError(new CustomError({
          error: JSON.stringify(error),
          statusCode: response.status
        }))
      }

      setCurentGroupUsers(_u => ({}));
      await streamDataFromReader({
        reader: response.body!.getReader(),
        onData: (data) => {
          const user = new User(JSON.parse(data))
          setAllUsers(u => ({ ...u, ...{ [user.id]: user } }));
          setCurentGroupUsers(users => ({ ...users, ...{ [user.id]: user } }));
        }
      }
      );
    }
    catch (e: any) {
      console.log(e)
      onError(new CustomError({
        error: JSON.stringify(e)
      }));
    }

  }

  const addUser = async (userId: string, groupID?: string) => {
    if (!groupID && !curentGroup) {
      return
    }
    if (!groupID) {
      groupID = curentGroup!.id
    }
    const response = await fetch("http://127.0.0.1:8000/chats/add-in-group", {
      method: "post",
      headers: {
        accept: "application/json",
        'Authorization': `Bearer ${user.access_token}`,
        'Content-Type': "application/json"
      },
      body: JSON.stringify({
        group_id: groupID,
        user_id: userId
      })
    });
    if (response.status !== 200) {
      onError(new CustomError({
        error: JSON.stringify(await response.json()),
        statusCode: response.status
      }))
    }
    const data = await response.json()
    setCurentGroupUsers(users => ({ ...users, ...{ [userId]: allUsers[userId] } }))
    tost.sucsess(`user added sucsessfuly`)
    console.log(data)
  }

  const sendGroupAddReq = async (groupId: string) => {
    const group = groups.find(group => group.id === groupId)
    if (group) {
      onError(new CustomError({
        error: "you are already in group",
      }))
      return
    }
    const response = await fetch("http://127.0.0.1:8000/chats/add-group-req", {
      method: "post",
      headers: {
        accept: "application/json",
        'Authorization': `Bearer ${user.access_token}`,
        'Content-Type': "application/json"
      },
      body: JSON.stringify(groupId)
    });
    if (response.status !== 200) {
      onError(new CustomError({
        error: JSON.stringify(JSON.stringify(await response.json())),
        statusCode: response.status
      }))
    }
    const data = await response.json()
    console.log(data)
    tost.sucsess("request send successfuly")

  }

  const deleteUser = async (userId: string, groupID?: string) => {
    if (!groupID && !curentGroup) {
      return
    }
    if (!groupID) {
      groupID = curentGroup!.id
    }
    const response = await fetch("http://127.0.0.1:8000/chats/delete-from-group", {
      method: "post",
      headers: {
        accept: "application/json",
        'Authorization': `Bearer ${user.access_token}`,
        'Content-Type': "application/json"
      },
      body: JSON.stringify({
        group_id: groupID,
        user_id: userId
      })
    });
    if (response.status !== 200) {
      onError(new CustomError({
        error: JSON.stringify(JSON.stringify(await response.json())),
        statusCode: response.status
      }))
    }
    const data = await response.json()
    const temp = curentGroupUsers
    delete temp[userId]
    setCurentGroupUsers(_users => ({ ...temp }))
    console.log(data)
    tost.sucsess("user deleted sucessfuly")

  }



  useEffect(() => {
    fetchGroups();
  }, [])


  useEffect(() => {
    if (curentGroup) {
      fetchUsersOfGroup(curentGroup.id)
      fetchChats(curentGroup.id)
    }
  }, [curentGroup])

  useEffect(() => {
    if (ws) {
      ws.onmessage = async (e) => {
        console.log(e.data)
        const msg = JSON.parse(e.data)
        if (msg.event === "new_group_add" || msg.event === "group_remove") {
          const group = new Group(JSON.parse(msg.data.group))
          if (msg.event === "new_group_add") {
            console.log("ok")
            setGroups(pre => [group, ...pre])
          }
          else {
            setCurentGroup(_p => undefined)
            setGroups(groups => {
              const index = groups.indexOf(groups.find(g => g.id === group.id)!)
              return [...groups.slice(0, index), ...groups.slice(index + 1, groups.length)]
            })

          }
        }
        else if (msg.event === "unauthorized" && msg.event === "error") {
          onError(new CustomError({
            error: `${msg}`
          }))
        }
        else {
          const chat = new Chat(JSON.parse(msg.data.chat));
          handleMassage(chat, msg.event)
        }
      }
    }

  }, [ws, curentGroup])


  return <GroupContext.Provider value={{ groups, chats, setCurentGroup, sendMassage, createGroup, curentGroup, addUser, deleteUser, allUsers, fetchUsers, curentGroupUsers, fetchAllGroups, sendGroupAddReq }}>
    {children}
  </GroupContext.Provider>
}




export { useGroup, GroupProvider, sendMassage }