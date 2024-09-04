import { Group } from '@/models/group-model';
import { User } from '@/models/user-model';
import { streamDataFromReader } from '@/utils/stream-data';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface GroupContextInterface {
   groups:Group[]
}
const GroupContext = createContext<GroupContextInterface | undefined>(undefined);

const useGroup = () => {
    const context = useContext(GroupContext);
    if (context === undefined) {
        throw new Error("useAuth must most be use with in a AuthProvider");
    }
    return context;
}

interface GroupPropsInterface {
    children: ReactNode,
    user:User,
    onError:(e:Error)=>void

}
const GroupProvider: React.FC<GroupPropsInterface> = ({ children,user,onError }) => {

    const [groups,setGroups]=useState<Group[]>([]);

    useEffect(()=>{

     fetch("http://127.0.0.1:8000/chats/groups",{
        method:"get",
        headers: {
          accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Bearer ${user?.access_token}`
      },
        }).then(async(data) => {
          streamDataFromReader(data.body!.getReader(),(data)=>{
            const group = new Group({...JSON.parse(data)})
            setGroups(groups=>[...groups,group])
          })
        }).catch(e=>{
           onError(new Error(e));
        })
    },[user])
    
    return <GroupContext.Provider value={{ groups }}>
        {children}
    </GroupContext.Provider>
}




export { useGroup , GroupProvider  }