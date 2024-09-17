import { ChangeEvent, useEffect, useState } from 'react'
import { Group } from '../../../models/group-model';
import { useGroup } from '../../../hooks/group-provider';

export default function AllGroupSidebar() {
    const [allGroups, setAllGroups] = useState<Group[]>([]);
    const { fetchAllGroups, sendGroupAddReq } = useGroup();
    const [search, setSearch] = useState("")

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }

    useEffect(() => {
        fetchAllGroups({
            onStart: () => setAllGroups(_g => []),
            onGroup: (group) => {
                setAllGroups(g => [...g, group])
            }
        })
    }, [])


    return (
        <div id='chat-sidebar' className='relative flex-1  bg-green-400 rounded flex flex-col overflow-y-auto no-scrollbar'>
            <div className="sticky w-full top-0 bg-red-400 p-2 min-h-14 rounded flex gap-3 items-center justify-center shadow-lg cursor-pointer" >
                <h5>Groups</h5>
            </div>

            <div className={`p-10 flex-1 flex flex-col`}>
                <div className="rounded-lg p-3 flex w-1/3 self-end  bg-white mb-3">
                    <input type="text" className='flex-1 outline-none text-black' placeholder='search' onChange={handleSearchChange} />
                    <img className='w-6' src="\public\icons\search.png" alt="search" />
                </div>
                {allGroups.map(
                    (group) => {
                        return (
                            (group.name.includes(search) || group.des.includes(search)) && <div key={group.id}>
                                <div className="flex gap-3 justify-between items-center p-2 cursor-pointer hover:bg-red-600 rounded transition-all duration-200 ease-in-out ">
                                    <div className="flex gap-3 items-center p-2">
                                        <div className="rounded-full bg-green-500 p-1 w-10 font-bold">
                                            <img src="\public\icons\group.png" alt="group" />
                                        </div>
                                        <div className="">
                                            <h4 className='text-lg'>{group.name}</h4>
                                            <i className='text-sm'>{group.des}</i>
                                        </div>
                                    </div>
                                    <div className="mr-2 hover:bg-green-500 p-2 w-10 rounded" onClick={() => sendGroupAddReq(group.id)}>
                                    <img src="\public\icons\add.png" alt="masssge" />
                                    </div>
                                </div>
                                <hr />
                            </div>
                        )
                    }
                )}

            </div>


        </div>)
}
