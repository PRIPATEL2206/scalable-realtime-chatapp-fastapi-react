import { useEffect, useState } from 'react'
import GroupSideBar from './components/group-sidebar'
import { useAuth } from '../../hooks/auth-provider'
import { GroupProvider } from '../../hooks/group-provider'
import { Outlet } from 'react-router-dom'


const   Chats = () => {
  const { user, logout } = useAuth()

  let [ws, setWS] = useState<WebSocket>();

  // const [showAllUser, setShowAllUser] = useState(false)
  // const [showAllGroups, setShowAllGroups] = useState(false)
  // const [showChatBar, setShowChatBar] = useState(true)

  // const sideBars={
  //   "chat-bar":setShowChatBar,
  //   "all-user":setShowAllUser,
  //   "all-group":setShowAllGroups,
  // }


  // const show=(sidebar:"chat-bar"|"all-user"|"all-group")=>{
  //   for (const sidebar in sideBars) {
  //     sideBars[sidebar as "chat-bar"|"all-user"|"all-group"](false)
  //   }
  //   sideBars[sidebar](true);
  // }


  useEffect(() => {
    if (ws === undefined) {
      setWS(new WebSocket("ws://localhost:8000/chats/ws"));
    }
  }, [])

  useEffect(() => {
    if (ws) {
      ws.onopen = (_e) => {
        console.log("conected")
        ws?.send(JSON.stringify({
          event: "Authorization",
          data: { Authorization: user?.access_token, }
        }))
      }
    }

  }, [ws])


  return (
    <GroupProvider user={user!} ws={ws} onError={(_e) => {
      logout();
    }}>

      <div className='flex w-screen h-screen overflow-hidden transition-all duration-1000 ease-in  scroll-smooth bg-green-400 '>
        <GroupSideBar />
        <Outlet />
        {/* {showChatBar && <ChatSideBar/>}
        {showAllUser && <AllUsersSideBar/>}
        {showAllGroups && <AllGroupSidebar/>} */}


        {/* <h1>user name {user?.name}</h1>
      <button onClick={handleClick}>send</button> */}

      </div>
    </GroupProvider>

  )
}

export default Chats
