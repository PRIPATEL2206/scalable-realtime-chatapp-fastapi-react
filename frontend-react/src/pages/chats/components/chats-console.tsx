import React, { useEffect } from 'react'
import { useAuth } from '../../../hooks/auth-provider'
import { useGroup } from '../../../hooks/group-provider'
import { getDataFromFormEvent } from '../../../utils/form-utils'

export default function ChatsConsole() {
    const{user} =useAuth()
  const { chats, curentGroup, curentGroupUsers, addUser,sendMassage } = useGroup()
  
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
    <>
          <div id="all-chats" className="px-10 flex-1 h-full overflow-auto">
            {chats.map(
              chat => {
                const isCurentUser = chat.senderId === user?.id
                return (
                  <div key={chat.id} className={`flex  ${chat.isAnyEvent ? "justify-center" : isCurentUser ? "justify-end" : ""} `}>
                    <div className={`w-fit min-w-12 p-2 my-2 rounded-lg ${isCurentUser ? "rounded-tr-none" : "rounded-tl-none"}  bg-gray-700`}>
                      {!chat.isAnyEvent &&
                       curentGroupUsers && 
                       <small>{isCurentUser ? "You" : curentGroupUsers[chat.senderId]?.name ?? chat.senderId}</small>}
                      
                      <h6>{chat.isConectionReq && chat.conReqSender ? `${chat.conReqSender.name} send request to join` : chat.msg}</h6>

                      {chat.isConectionReq && 
                      chat.conReqSender && 
                      curentGroup?.createdBy === user?.id && 
                      <button className='w-full bg-green-600 hover:bg-green-800 disabled:bg-gray-400' disabled={curentGroupUsers[chat.senderId] !== undefined} onClick={() => {
                        addUser(chat.conReqSender!.id, curentGroup?.id)
                      }}>{curentGroupUsers[chat.senderId] === undefined ? "Add" : "Added"}</button>}
                      <h6 className='text-[10px] float-end '>{`${chat.createdAt.toLocaleTimeString()}`}</h6>

                    </div>
                  </div>
                )
              }
            )}

          </div>
          {curentGroup && <div className=" static bottom-0  h-14 pb-3 rounded w-full bg-green-400 flex-initial">
            <form className="mb-2 h-full w-full flex px-5 gap-4" onSubmit={handleSendMassge}>
              <input id='chat' type="text" name="chat" className='rounded-2xl outline-none flex-grow p-5 text-black' />
              <button className='bg-black rounded-full p-2'>send</button>
            </form>
          </div>}
        </>
  )
}
