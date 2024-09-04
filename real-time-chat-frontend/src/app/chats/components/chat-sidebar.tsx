import { useAuth } from '@/hooks/auth-provider'
import { useGroup } from '@/hooks/group-provider'
import { getDataFromFormEvent } from '@/utils/form-utils'
import React, { useEffect, useRef } from 'react'

export default function ChatSideBar() {
  const { chats } = useGroup()
  const { user } = useAuth()

  const handleSendMassge = (form: React.FormEvent<HTMLFormElement>)=>{
    form.preventDefault()
    const { chat } = getDataFromFormEvent(form)
    console.log(chat)
  }

  useEffect(() => {
    const chatSideBar = document.getElementById('chat-sidebar');
    chatSideBar?.scrollTo(0, chatSideBar.scrollHeight)
  }, [chats])
  return (
    <div id='chat-sidebar' className='relative flex-1 w-full bg-green-400 rounded  h-full overflow-auto '>
      <div className="p-10 mb-10 flex-1 ">

        {chats.map(
          chat => {
            const isCurentUser = chat.sender_id === user?.id
            return (
              <div className={`flex  ${isCurentUser ? "justify-end" : ""} `}>

                <div key={chat.id} className={`w-fit min-w-12 p-2 my-2 rounded ${isCurentUser ? "rounded-tr-none" : "rounded-tl-none"}  bg-gray-700`}>
                  <h6>{chat.msg}</h6>
                </div>
              </ div>
            )
          }
        )}
      </div>

      <div className="fixed bottom-0 right-0 h-14 pb-3 rounded w-[76.5%] bg-green-400">
        <form className="mb-2 h-full flex px-5 gap-4" onSubmit={handleSendMassge}>
          <input type="text" name="chat" className='rounded-3xl flex-1 h-full p-5 text-black' />
          <button className='bg-black rounded-full p-2'>send</button>
        </form>
      </div>
    </div>
  )
}
