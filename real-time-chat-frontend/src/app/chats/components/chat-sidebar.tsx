import { useAuth } from '@/hooks/auth-provider'
import { sendMassage, useGroup } from '@/hooks/group-provider'
import { getDataFromFormEvent } from '@/utils/form-utils'
import React, { ReactNode, useEffect, useRef, useState } from 'react'
import AllUsersSideBar from './all-usersidebar';
import GroupUsersSideBar from './group-users-sidebar';
import ChatsConsole from './chats-console';

export default function ChatSideBar() {
  const [show, setShow] = useState<"chat" | "add-user" | 'group-user'|"nothing">("chat");
  const [component, setComponent] = useState<ReactNode>();

  const { curentGroup, curentGroupUsers ,deleteUser} = useGroup()
  const { user } = useAuth()

  useEffect(() => {
    if (curentGroup) {
      setShow("chat")
      return
    }
    setShow("nothing")
  }, [curentGroup])



  useEffect(() => {
    switch (show) {
      case 'add-user':
        setComponent(<AllUsersSideBar isForAddDelete={true} />)
        break;
      case 'group-user':
        setComponent(<GroupUsersSideBar />)
        break;
      case 'chat':
        setComponent(<ChatsConsole />)
        break;

      default:
        setComponent(undefined)
        break;
    }
  }, [show])

  return (
    <div id='chat-sidebar' className='relative flex-1 bg-green-400 rounded flex flex-col'>
      <div className="sticky w-full bg-red-400 p-2 min-h-14 rounded flex gap-3 items-center justify-between shadow-lg cursor-pointer" >
        {curentGroup && <>
          <div className="flex gap-3 items-center " onClick={()=>setShow("group-user")}>
            <div className="rounded-full bg-green-500 px-4 py-2">{(curentGroup.is_individual_group && curentGroupUsers[curentGroup.name] ? curentGroupUsers[curentGroup.name].name : curentGroup.name).charAt(0).toUpperCase()}</div>
            <h5>{curentGroup.is_individual_group && curentGroupUsers[curentGroup.name] ? curentGroupUsers[curentGroup.name].name : curentGroup.name}</h5>
          </div>
          {
          show ==="chat" && 
          !curentGroup.is_individual_group && 
          (  curentGroup.created_by === user?.id?
           <div className="px-2  hover:bg-green-500  rounded-lg  mr-3 text-3xl " onClick={() => setShow("add-user")} >+</div>
           :<div className='p-2  hover:bg-red-500  rounded-lg  mr-3 text-xl' onClick={()=>deleteUser(user!.id,curentGroup.id)}>leave</div>
           )}
          {show!=="chat" && <div className="px-2  hover:bg-green-500  rounded-lg  mr-3 text-3xl " onClick={() => setShow("chat")} >X</div>}
        </>}
      </div>
      {component}

    </div>
  )
}

const chats = () => {

}
