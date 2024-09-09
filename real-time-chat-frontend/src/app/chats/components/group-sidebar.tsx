import { useAuth } from '@/hooks/auth-provider'
import { useGroup } from '@/hooks/group-provider'
import { tost } from '@/hooks/tost-provider'
import { getDataFromFormEvent } from '@/utils/form-utils'
import React, { useState } from 'react'

export default function GroupSideBar({ show }: { show: (sidebar: "chat-bar" | "all-user") => void }) {
  const { groups, setCurentGroup: setCurentGroupIndex, createGroup, curentGroup, allUsers: curentGroupUsers } = useGroup()
  const { logout } = useAuth()

  const [showCreateGroup, setShowCreateGroup] = useState(false)

  const handleCreateGroup = (form: React.FormEvent<HTMLFormElement>) => {
    form.preventDefault()
    const { groupName, des } = getDataFromFormEvent(form);
    createGroup({ groupName, des }).then(() => {
      setShowCreateGroup(false);
    }).catch(e => {
      tost.error(e)
    })
  }

  return (
    <div className=" bg-red-400 flex flex-col w-80 pt-4 rounded-r-md relative">
      <div className="h-fit">

        <button className='p-2 w-full hover:bg-red-600 text-start rounded' onClick={() => setShowCreateGroup(pre => !pre)}>
          {showCreateGroup ? "Close" : "+ Create Group"}
        </button>
        <button className='p-2 w-full hover:bg-red-600 text-start rounded' onClick={logout}>
          logout
        </button>
        {showCreateGroup &&
          <form className="flex flex-col gap-2 mt-2" onSubmit={handleCreateGroup}>
            <input name="groupName" className='p-2 rounded text-black' placeholder='group name' type="text" />
            <textarea name="des" className='p-2 rounded text-black' placeholder='descreption' />
            <button className='hover:bg-red-600 rounded py-2'>create</button>
          </form>}
      </div>
      <div className='mt-5  overflow-y-auto flex-1 '>
        {groups && groups.map(
          (group, i) => {
            const gName=group.is_individual_group && curentGroupUsers[group.name] ? curentGroupUsers[group.name].name : group.name
            return <div className="" key={group.id}>
              <div className={`flex gap-3 h-14 items-center p-2 cursor-pointer ${(curentGroup && group.id === curentGroup!.id) ? "bg-red-600" : ""} hover:bg-red-600 rounded transition-all duration-200 ease-in-out `}
                onClick={() => {
                  setCurentGroupIndex(group)
                  show("chat-bar")
                  document.getElementById("chat")?.focus()
                }} >
                <div className="rounded-full bg-green-500 px-4 py-2">{gName.charAt(0).toUpperCase()}</div>
                <h5 className=''>{(gName).slice(0, 20)}</h5>
              </div>
              <hr />
            </div>
          }

        )}
      </div>

      <button className='absolute bottom-5 right-1 p-2  bg-gray-500 hover:bg-red-600 text-start rounded' onClick={() => show("all-user")}>
        New Massage
      </button>
      <button className='absolute bottom-5 left-1 p-2 bg-gray-500  hover:bg-red-600 text-start rounded' onClick={() => show("all-user")}>
        groups
      </button>
    </div>

  )
}
