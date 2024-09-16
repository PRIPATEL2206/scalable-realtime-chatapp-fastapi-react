import React, { useEffect } from 'react'
import { useAuth } from '../../../hooks/auth-provider'
import { useGroup } from '../../../hooks/group-provider'
import { getDataFromFormEvent } from '../../../utils/form-utils'

export default function ChatsConsole() {
  const { user } = useAuth()
  const { chats, curentGroup, curentGroupUsers, addUser, sendMassage } = useGroup()
  let curentChatDate = ""

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

      <div id="all-chats" className="px-10 flex-1 h-full overflow-auto no-scrollbar">
        {chats.map(
          chat => {
            let isNewDate = false
            let isTodayDate = false
            // check for date change
            if (chat.createdAt.toLocaleDateString() !== curentChatDate) {
              isNewDate = true;
              curentChatDate = chat.createdAt.toLocaleDateString()
            }
            // check for todays chats
            if (isNewDate && chat.createdAt.toLocaleDateString()===(new Date()).toLocaleDateString()) {
              isTodayDate=true
            }
            const isCurentUser = chat.senderId === user?.id
            return (
              <>{isNewDate &&
                <div  className=' flex justify-center sticky top-0  border-t-2 pt-2'>
                  <div className="bg-gray-500  rounded-full px-3 text-xs">{isTodayDate?"Today":curentChatDate}</div>
                </div>}
                <div key={chat.id} className={`flex  ${chat.isAnyEvent ? "justify-center" : isCurentUser ? "justify-end" : ""} `}>
                  <div className={`w-fit min-w-12 p-2 my-2 rounded-lg ${isCurentUser ? "rounded-tr-none" : "rounded-tl-none"}  ${chat.isAnyEvent ? "bg-gray-400" : "bg-gray-200"}`}>
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
                    <h6 className='text-[10px] float-end '>{`${chat.createdAt.toLocaleTimeString().slice(0, -6)} ${chat.createdAt.toLocaleTimeString().slice(-3)}`}</h6>

                  </div>
                </div>
              </>

            )
          }
        )}

      </div>
      {curentGroup && <div className=" static bottom-0  h-14 pb-3 rounded w-full bg-green-400 flex-initial">
        <form className="mb-2 h-full w-full flex px-5 gap-4" onSubmit={handleSendMassge}>
          <input id='chat' type="text" name="chat" className='rounded-2xl outline-none flex-grow p-5 text-black' />
          <button className='bg-red-500 rounded-xl px-2 outline-none hover:bg-red-600'>send</button>
        </form>
      </div>}
    </>
  )
}
