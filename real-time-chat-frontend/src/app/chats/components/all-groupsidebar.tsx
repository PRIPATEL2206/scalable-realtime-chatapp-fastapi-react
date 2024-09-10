import { useAuth } from '@/hooks/auth-provider'
import { useGroup } from '@/hooks/group-provider';
import { tost } from '@/hooks/tost-provider';
import { Group } from '@/models/group-model';
import { User } from '@/models/user-model'
import { streamDataFromReader } from '@/utils/stream-data';
import React, { useEffect, useState } from 'react'

export default function AllGroupSidebar() {
    const [allGroups,setAllGroups]=useState<Group[]>([]);
    const { fetchAllGroups, sendGroupAddReq } = useGroup();



    useEffect(() => {
        fetchAllGroups({
            onStart:()=>setAllGroups(g=>[]),
            onGroup:(group)=>{
            setAllGroups(g=>[...g,group])
        }})
    }, [])
    

    return (
        <div id='chat-sidebar' className='relative w-full  bg-green-400 rounded overflow-y-scroll '>
             <div className="sticky w-full top-0 bg-red-400 p-2 min-h-14 rounded flex gap-3 items-center justify-center shadow-lg cursor-pointer" >
                <h5>Groups</h5>
            </div>
            
            <div className={`p-10 my-10 flex-1`}>
                {allGroups.map(
                    (group) => {
                       
                        return (
                            <div key={group.id}>
                                <div className="flex gap-3 justify-between items-center p-2 cursor-pointer hover:bg-red-600 rounded transition-all duration-200 ease-in-out ">
                                    <div className="flex gap-3 items-center p-2">
                                        <div className="rounded-full bg-green-500 px-4 py-2 font-bold">{group.name.charAt(0).toUpperCase()}</div>
                                        <div className="">
                                            <h4 className='text-lg'>{group.name}</h4>
                                            <i className='text-sm'>{group.des}</i>
                                        </div>
                                    </div>
                                    <div className="mr-2 hover:bg-green-500 px-2 py-3 rounded" onClick={() => sendGroupAddReq(group.id)}>Request to Join</div>
                                </div>
                                <hr />
                            </div>
                        )
                    }
                )}

            </div>


        </div>)
}
