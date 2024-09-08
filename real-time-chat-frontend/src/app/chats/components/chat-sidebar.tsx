import { useAuth } from '@/hooks/auth-provider'
import { sendMassage, useGroup } from '@/hooks/group-provider'
import { getDataFromFormEvent } from '@/utils/form-utils'
import React, { useEffect, useRef, useState } from 'react'
import AllUsersSideBar from './all-usersidebar';

export default function ChatSideBar() {
  const [showAddUser, setShowAddUser] = useState(false);

  const { chats, sendMassage, curentGroup , curentGroupUsers } = useGroup()
  const { user } = useAuth()

  const handleSendMassge = (form: React.FormEvent<HTMLFormElement>) => {
    form.preventDefault()
    const { chat } = getDataFromFormEvent(form);
    sendMassage(chat);
    (document.getElementById("chat")! as HTMLInputElement).value = ""
  }

  useEffect(() => {
    const chatSideBar = document.getElementById('all-chats');
    chatSideBar?.scrollTo(0, chatSideBar.scrollHeight)
  }, [chats])
  return (
    <div id='chat-sidebar' className='relative flex-auto  bg-green-400 rounded '>
      <div className="sticky w-full bg-red-400 p-2 min-h-14 rounded flex gap-3 items-center justify-between shadow-lg cursor-pointer" >
        {curentGroup && <>
          <div className="flex gap-3 items-center ">
            <div className="rounded-full bg-green-500 px-4 py-2">{curentGroup.name.charAt(0).toUpperCase()}</div>
            <h5>{curentGroup.name}</h5>
          </div>
          <div className="px-2  hover:bg-green-500 rounded-lg mr-3 text-3xl " onClick={() => setShowAddUser(pre => !pre)} >{showAddUser ? "X" : "+"}</div>
        </>}
      </div>

      {
        showAddUser ?
          <AllUsersSideBar isForAddDelete={true} /> :
          <>
            <div id="all-chats" className="px-10 h-[83%] overflow-y-auto">
              {chats.map(
                chat => {
                  const isCurentUser = chat.sender_id === user?.id
                  return (
                    <div key={chat.id} className={`flex  ${isCurentUser ? "justify-end" : ""} `}>
                      <div className={`w-fit min-w-12 p-2 my-2 rounded ${isCurentUser ? "rounded-tr-none" : "rounded-tl-none"}  bg-gray-700`}>
                        <small>{isCurentUser?"You": curentGroupUsers[chat.sender_id].name}</small>
                        <h6>{chat.msg}</h6>
                      </div>
                    </div>
                  )
                }
              )}
            </div>
          </>

      }
      {curentGroup && <div className="mt-10 sticky bottom-0  h-14 pb-3 rounded w-full bg-green-400">
        <form className="mb-2 h-full w-full flex px-5 gap-4" onSubmit={handleSendMassge}>
          <input id='chat' type="text" name="chat" className='rounded-2xl outline-none flex-grow p-5 text-black' />
          <button className='bg-black rounded-full p-2'>send</button>
        </form>
      </div>}


    </div>
  )
}
