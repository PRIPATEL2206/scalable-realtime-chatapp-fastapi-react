
import React, { useState } from 'react'
import { useGroup } from '../../../hooks/group-provider'
import { getDataFromFormEvent } from '../../../utils/form-utils'
import { tost } from '../../../hooks/tost-provider'
import { Link } from 'react-router-dom'

export default function GroupSideBar() {
  const { groups, setCurentGroup, createGroup, curentGroup, allUsers } = useGroup()


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
    <div className=" bg-red-400 flex flex-col w-80 p-1 pt-4 rounded-r-md relative">
      <div className="h-fit flex justify-between ">

        <button className='p-1  w-9 hover:bg-red-600 text-start rounded' onClick={() => setShowCreateGroup(pre => !pre)}>
          {showCreateGroup ? <img src="\public\icons\back.png" alt="close" /> :
            <img src="\public\icons\createGroup.png" alt="create group" />
          }
        </button>
        <Link to="/chats/all-groups" className='p-1 w-9 hover:bg-red-600 text-start rounded' >
          <img src="\public\icons\networking.png" alt="create group" />

        </Link>
        <Link to="/chats/all-users" className='p-3 w-14 absolute bottom-3 right-3 rounded-full hover:bg-red-600 text-start ' >
          <img src="\public\icons\chat.png" alt="create group" />
        </Link>
        <Link to="profile" className='p-1  w-9 hover:bg-red-600 text-start rounded-lg' >
          <img src="\public\icons\profile-user.png" alt="profile" />
        </Link>
      </div>
      {showCreateGroup &&
        <form className="flex flex-col gap-2 mt-2" onSubmit={handleCreateGroup}>
          <input name="groupName" className='p-2 rounded text-black' placeholder='group name' type="text" />
          <textarea name="des" className='p-2 rounded text-black' placeholder='descreption' />
          <button className='hover:bg-red-600 rounded w-10 m-auto p-1'>
            <img src="\public\icons\createGroup.png" alt="create group" />
          </button>
        </form>}
      <div className='my-1 overflow-y-auto flex-1 no-scrollbar'>
      <Link to="/chats/gemini" >
              <div className={`flex gap-3 h-14 items-center p-2 cursor-pointer  hover:bg-red-600 rounded transition-all duration-200 ease-in-out `}
                onClick={() => {
                  setTimeout(() => {
                    document.getElementById("chat")?.focus()
                  }, 300);

                }} >
                <div className="rounded-full w-8 bg-red-400 p-1">
                      <img src="\public\icons\gemini.png" alt="group" />
                </div>
                <h5 className=''>Gemini</h5>
              </div>
              <hr />
            </Link>
        {groups.map(
          (group) => {
            const gName = (group.isIndividualGroup && allUsers[group.name]) ? allUsers[group.name].name : group.name
            return <Link to={`/chats/${group.id}`} className="" key={group.id} >
              <div className={`flex gap-3 h-14 items-center p-2 cursor-pointer ${(curentGroup && group.id === curentGroup!.id) ? "bg-red-600" : ""} hover:bg-red-600 rounded transition-all duration-200 ease-in-out `}
                onClick={() => {
                  setCurentGroup(group);
                  setTimeout(() => {
                    document.getElementById("chat")?.focus()
                  }, 300);

                }} >
                <div className="rounded-full w-8 bg-red-400 p-1">
                  {
                    group.isIndividualGroup ?
                      <img src="\public\icons\user.png" alt="user" /> :
                      <img src="\public\icons\group.png" alt="group" />
                  }
                </div>
                <h5 className=''>{(gName).slice(0, 20)}</h5>
              </div>
              <hr />
            </Link>
          }

        )}
      </div>


    </div>

  )
}
