import React, { useEffect } from 'react'
import { useAuth } from '../../../hooks/auth-provider'
import { getDataFromFormEvent } from '../../../utils/form-utils'
import { useGemini } from '../../../hooks/gemini-provider'

export default function GeminiConsole() {
  const { user } = useAuth()
  const { chats, sendPrompt } = useGemini();

  const handleSendMassge = (form: React.FormEvent<HTMLFormElement>) => {
    form.preventDefault()
    const { chat } = getDataFromFormEvent(form);

    sendPrompt(chat);
    (document.getElementById("chat")! as HTMLInputElement).value = ""
  }

  useEffect(() => {
    const chatSideBar = document.getElementById('all-chats');
    chatSideBar?.scrollTo(0, chatSideBar.scrollHeight)
  }, [chats])


  return (
    <>
      <div id="all-chats" className="px-10 flex-1 h-full overflow-auto no-scrollbar">
        {chats.map(
          (chat, i) => {
            const isCurentUser = chat.senderId === user?.id
            return (
              <div key={i} className={`flex ${isCurentUser ? "justify-end" : ""} `}>
                <div className={`min-w-12 max-w-[50%] p-2 my-2 rounded-lg ${isCurentUser ? "rounded-tr-none" : "rounded-tl-none"}  bg-gray-200`}>
                  <small>{isCurentUser ? "You" : "Gemini"}</small>
                  <h6>{chat.msg}</h6>
                  <h6 className='text-[10px] float-end '>{`${chat.createdAt.toLocaleTimeString().slice(0, -6)} ${chat.createdAt.toLocaleTimeString().slice(-3)}`}</h6>
                </div>
              </div>
            )
          }
        )}

      </div>
      {<div className=" static bottom-0  h-14 pb-3 rounded w-full bg-green-400 flex-initial">
        <form className="mb-2 h-full w-full flex px-5 gap-3" onSubmit={handleSendMassge}>
          <input id='chat' type="text" name="chat" className='rounded-2xl outline-none flex-grow p-5 text-black' />
          <button className='rounded-full p-2 w-10 outline-none hover:bg-green-600'>
            <img src="\public\icons\send.png" alt="create group" />
          </button>
        </form>
      </div>}
    </>
  )
}
