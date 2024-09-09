import { Chat } from '@/models/chat-model';
import { Group } from '@/models/group-model';
import { User } from '@/models/user-model';
import { streamDataFromReader } from '@/utils/stream-data';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

interface GroupContextInterface {
  groups: Group[]
  chats: Chat[]
  curentGroup?: Group
  setCurentGroup: (group: Group) => void
  sendMassage: (msg: string) => void
  createGroup: ({ groupName, des, isIndividual }: { groupName: string, des: string, isIndividual?: boolean }) => Promise<Group>
  addUser: (userId: string, groupId?: string) => Promise<void>
  deleteUser: (userId: string, groupId?: string) => Promise<void>
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
  onError?: (e: Error) => void,
  ws?: WebSocket

}
const GroupProvider: React.FC<GroupPropsInterface> = ({ children, user, onError, ws }) => {

  const [groups, setGroups] = useState<Group[]>([]);
  const [curentGroup, setCurentGroup] = useState<Group>();
  const [chats, setChats] = useState<Chat[]>([]);
  const [allUsers, setAllUsers] = useState<{ [uid: string]: User }>({});
  const [curentGroupUsers, setCurentGroupUsers] = useState<{ [uid: string]: User }>({});

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
        console.log(error)
        if (onError)
          onError(Error(error))
      }
      setGroups(g => [])
      const inividualChatsUsers: string[] = []
      streamDataFromReader(
        {
          reader: response.body!.getReader(),
          onData: (data) => {
            const group = new Group(JSON.parse(data))
            if (group.is_individual_group) {
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
      if (onError)
        onError(new Error(e));
    }

  }
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
        console.log(error)
        if (onError) {
          onError(error)
        }
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
      if (onError) {
        onError(e)
      }
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
        if (onError)
          onError(Error(error))
      }
      setChats(c => [])
      streamDataFromReader({
        reader: response.body!.getReader(),
        onData: (data) => {
          const chat = new Chat(JSON.parse(data))
          setChats(chats => [...chats, chat])
        }
      }
      );
    }
    catch (e: any) {
      console.log(e)
      if (onError)
        onError(new Error(e));
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
        if (onError)
          onError(Error(error))
      }

      setCurentGroupUsers(u => ({}));
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
      if (onError)
        onError(new Error(e));
    }

  }

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
      throw Error(JSON.stringify(await response.json()))
    }
    const data = await response.json()
    const newGroup = new Group({ ...data });
    setGroups(groups => [newGroup, ...groups])
    return newGroup
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
      if (onError) {

        onError(Error(JSON.stringify(await response.json())))
      }
    }
    const data = await response.json()
    setCurentGroupUsers(users => ({ ...users, ...{ [userId]: allUsers[userId] } }))
    console.log(data)
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
      if (onError) {
        onError(Error(JSON.stringify(await response.json())))
      }
    }
    const data = await response.json()
    const temp=curentGroupUsers
      delete temp[userId]
    setCurentGroupUsers(users =>({...temp}))
    console.log(data)
  }

  useEffect(() => {
    fetchGroups();
  }, [user])

  useEffect(() => {
    if (ws) {
      ws.onmessage = (e) => {
        console.log(e.data)
        const msg = JSON.parse(e.data)
        if (msg.event !== "unauthorized" && msg.event !== "error") {
          const chat = new Chat(JSON.parse(msg.data.chat));
          if (msg.event !== "massage_send") {
            setChats(chats => [...chats, chat]);
            setGroups(groups => {
              const index = groups.map(groups => groups.id).indexOf(chat.group_id)
              return [groups[index], ...groups.slice(0, index), ...groups.slice(index + 1, groups.length)]
            })
          }

        }
      }
    }

  }, [ws])

  useEffect(() => {
    if (curentGroup) {
      fetchUsersOfGroup(curentGroup.id)
      fetchChats(curentGroup.id)
    }
  }, [curentGroup])

  return <GroupContext.Provider value={{ groups, chats, setCurentGroup, sendMassage, createGroup, curentGroup, addUser, deleteUser, allUsers, fetchUsers, curentGroupUsers }}>
    {children}
  </GroupContext.Provider>
}




export { useGroup, GroupProvider, sendMassage }