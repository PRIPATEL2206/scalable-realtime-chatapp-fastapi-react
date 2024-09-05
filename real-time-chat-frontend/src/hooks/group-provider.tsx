import { Chat } from '@/models/chat-model';
import { Group } from '@/models/group-model';
import { User } from '@/models/user-model';
import { streamDataFromReader } from '@/utils/stream-data';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

interface GroupContextInterface {
  groups: Group[]
  chats: Chat[]
  curentGroup?:Group
  setCurentGroupIndex: (group:Group) => void
  sendMassage: (msg: string) => void
  createGroup: (groupName: string,des:string,isIndividual?:boolean) => Promise<void>

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


  const fetchGroups = async () => {

    try {
      const response = await fetch("http://127.0.0.1:8000/chats/groups", {
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
      streamDataFromReader(
        {
          reader: response.body!.getReader(),
          onData: (data) => {
            const group = new Group(JSON.parse(data))
            setGroups(groups => [...groups, group])
          },
         
        }
        ,)
    }
    catch (e: any) {
      console.log(e)
      if (onError)
        onError(new Error(e));
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

  const createGroup = async (groupName: string,des:string,isIndividual:boolean=false) => {
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
    if (response.status!==200) {
      throw Error(JSON.stringify(await response.json()))
    }
    const data = await response.json()
    const newGroup = new Group({...data});
    setGroups(groups=>[newGroup,...groups])
  }

  useEffect(() => {
      fetchGroups();
    }, [user])

  useEffect(() => {
      if (ws) {
        ws.onmessage = (e) => {
          const msg = JSON.parse(e.data)
          if (msg.event == "massage_send" || msg.event == "massage_recive") {
            const chat = new Chat(JSON.parse(msg.data.chat));
            if (msg.event == "massage_recive") {
              setChats(chats => [...chats, chat]);

              setGroups(groups=>{
                const index = groups.map(groups=>groups.id).indexOf(chat.group_id)
                return [groups[index],...groups.slice(0,index),...groups.slice(index+1,groups.length)]
              })
            }
          }
        }
      }

    }, [ws])

  useEffect(() => {
      if (curentGroup) {
        fetchChats(curentGroup.id)
      }
    }, [curentGroup])

  return <GroupContext.Provider value={{ groups, chats, setCurentGroupIndex: setCurentGroup, sendMassage, createGroup,curentGroup }}>
      {children}
    </GroupContext.Provider>
  }




  export { useGroup, GroupProvider, sendMassage }