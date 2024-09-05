import { useGroup } from '@/hooks/group-provider'
import { tost } from '@/hooks/tost-provider'
import { getDataFromFormEvent } from '@/utils/form-utils'
import React, { useState } from 'react'

export default function GroupSideBar() {
  const { groups, setCurentGroupIndex, createGroup,curentGroup } = useGroup()

  const [showCreateGroup, setShowCreateGroup] = useState(false)

  const handleCreateGroup = (form: React.FormEvent<HTMLFormElement>) => {
    form.preventDefault()
    const { groupName, des } = getDataFromFormEvent(form);
    createGroup(groupName, des).then(() => {
      setShowCreateGroup(false);
    }).catch(e => {
      tost.error(e)
    })
  }

  return (
    <div className=" bg-red-400  min-w-80 p-5 rounded-r-md">
      <div className="  ">

        <button className='p-2 w-full hover:bg-red-600 text-start rounded' onClick={() => setShowCreateGroup(pre => !pre)}>
          {showCreateGroup ? "close" : "+ Create Group"}
        </button>

        {showCreateGroup &&
          <form className="flex flex-col gap-2 mt-2" onSubmit={handleCreateGroup}>
            <input name="groupName" className='p-2 rounded text-black' placeholder='group name' type="text" />
            <textarea name="des" className='p-2 rounded text-black' placeholder='descreption' />
            <button className='hover:bg-red-600 rounded p-1'>create</button>
          </form>}
      </div>
      <div className='mt-5'>
        {groups.map(
          (group, i) => (
            <div className={`p-2 cursor-pointer ${(curentGroup && group.id === curentGroup!.id)?"bg-red-600":""} hover:bg-red-600 rounded`} onClick={() => {
              setCurentGroupIndex(group)
              document.getElementById("chat")?.focus()
            }} key={group.id}>
              <h5>{group.name}</h5>
              <hr />
            </div>
          )
        )}
      </div>
    </div>

  )
}
