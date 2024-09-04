import { Chat } from '@/models/chat-model';
import { Group } from '@/models/group-model';
import { User } from '@/models/user-model';
import { streamDataFromReader } from '@/utils/stream-data';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

interface GroupContextInterface {
  groups: Group[]
  chats: Chat[]
  setCurentGroupIndex: (index: number) => void
  sendMassage: (msg: string) => void

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
  const [curentGroupIndex, setCurentGroupIndex] = useState<number>(-1);
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
            const group = new Group(JSON.parse(data) )
            setGroups(groups => [...groups, group])
          },
          onComplate: () => {
            if (groups.length > 0)
              setCurentGroupIndex(-1)
          }
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
          const chat = new Chat(JSON.parse(data) )
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

  const sendMassage = (msg: string) => {
    if (curentGroupIndex !== -1) {
      ws?.send(JSON.stringify({
        "event": "massage_send",
        "data": {
          "group_id": groups[curentGroupIndex].id,
          "msg": msg
        }
      }));
    }
  }

  useEffect(() => {
    fetchGroups();
  }, [user])

  useEffect(() => {
    if (ws) {
      ws.onmessage = (e) => {
        const msg = JSON.parse(e.data)
        if (msg.event == "massage_send" || msg.event == "massage_recive") {
         const chat= new Chat(JSON.parse(msg.data.chat));

         if(msg.event == "massage_recive"){
          setChats(chats=>[...chats,chat])
         }
        }
      }
    }

  }, [ws])

  useEffect(() => {
    if (curentGroupIndex !== -1) {
      fetchChats(groups[curentGroupIndex].id)
    }
  }, [curentGroupIndex])

  return <GroupContext.Provider value={{ groups, chats, setCurentGroupIndex, sendMassage }}>
    {children}
  </GroupContext.Provider>
}




export { useGroup, GroupProvider, sendMassage }