'use client'
import { loginRequired, useAuth } from '@/hooks/auth-provider'
import { GroupProvider } from '@/hooks/group-provider'
import React, { useEffect, useState } from 'react'
import GroupSideBar from './components/group-sidebar'
import ChatSideBar from './components/chat-sidebar'
import AllUsersSideBar from './components/all-usersidebar'


const Chats = () => {
  const { user, logout } = useAuth()
  let [ws,setWS]=useState<WebSocket>() ;

  const [showAllUser, setShowAllUser] = useState(false)
  const [showChatBar, setShowChatBar] = useState(true)

  const sideBars={
    "chat-bar":setShowChatBar,
    "all-user":setShowAllUser
  }


  const show=(sidebar:"chat-bar"|"all-user")=>{
    for (const sidebar in sideBars) {
      sideBars[sidebar as "chat-bar"|"all-user"](false)
    }
    sideBars[sidebar](true);
  }


  useEffect(() => {
    if (ws === undefined) {
      setWS( new WebSocket("ws://localhost:8000/chats/ws"));
    }},[])

useEffect(()=>{
  if(ws){
    ws.onopen = (e) => {
      console.log("conected")
      ws?.send(JSON.stringify({
        event: "Authorization",
        data: { Authorization: user?.access_token, }
      }))
    }
  }

  }, [ws])


  return (
    <GroupProvider user={user!} ws={ws}  onError={(e)=>{
      console.log(e);
      logout();
      }}>

      <div className='flex w-screen h-screen overflow-hidden transition-all duration-1000 ease-in  scroll-smooth '>
        <GroupSideBar   show={show}/>
        {showChatBar && <ChatSideBar/>}
        {showAllUser && <AllUsersSideBar/>}


        {/* <h1>user name {user?.name}</h1>
      <button onClick={handleClick}>send</button> */}

      </div>
    </GroupProvider>

  )
}

export default loginRequired(Chats)
