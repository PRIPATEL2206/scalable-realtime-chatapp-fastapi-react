import { useGroup } from '@/hooks/group-provider'
import React from 'react'

export default function GroupSideBar() {
    const {groups,setCurentGroupIndex} = useGroup()
  return (
    <div className='min-w-80 bg-red-400  p-5 rounded-r-md' >
      {groups.map(
        (group,i)=>(
            <div className='p-2 cursor-pointer hover:bg-red-600 rounded' onClick={()=>setCurentGroupIndex(i)} key={group.id}>
                <h5>{group.name}</h5>
                <hr />
            </div>
        )
      )}
    </div>
  )
}
