import { ChangeEvent, useEffect, useState } from 'react'
import { useAuth } from '../../../hooks/auth-provider';
import { Group } from '../../../models/group-model';
import { useGroup } from '../../../hooks/group-provider';
import { useNavigate } from 'react-router-dom';

export default function AllUsersSideBar({ isForAddDelete = false }: { isForAddDelete?: boolean }) {
    const [userIds, setUserIds] = useState<string[]>([])
    const [search, setSearch] = useState("");
    const { user: curentUser } = useAuth();
    const navigate = useNavigate()
    const { addUser, deleteUser, createGroup, fetchUsers, curentGroupUsers, allUsers, groups, setCurentGroup } = useGroup();

    const handlePersonalMsg = async (userId: string) => {
        let chatWithUser: Group | undefined = groups.filter(group => group.isIndividualGroup).find((group) => group.name === userId);
        if (!chatWithUser) {
            const group = await createGroup({
                groupName: `${curentUser?.id}:${userId}`,
                des: "",
                isIndividual: true
            });
            if (userId !== curentUser?.id) {
                await addUser(userId, group.id)
            }
            chatWithUser = group
        }
        setCurentGroup(chatWithUser)
        navigate(`/chats/${chatWithUser.id}`)
    }

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }


    useEffect(() => {
        fetchUsers({})
        // console.log((allUsers))
    }, [])
    useEffect(() => {

        setUserIds(_ids => [])
        for (const ke in allUsers) {
            setUserIds(ids => [...ids, ke])
        }

    }, [allUsers])

    return (
        <div id='chat-sidebar' className='relative flex-1  bg-green-400 rounded flex flex-col overflow-y-auto no-scrollbar '>
            {!isForAddDelete && <div className="sticky w-full top-0 bg-red-400 p-2 min-h-14 rounded flex gap-3 items-center justify-center shadow-lg cursor-pointer" >
                <h5>Users</h5>
            </div>
            }

            <div className={`p-10 flex-1 flex flex-col`}>
                <div className="rounded-lg flex  p-3 w-1/3 self-end  bg-white mb-3">
                    <input type="text" className='flex-1 outline-none text-black' placeholder='search' onChange={handleSearchChange} />
                    <img className='w-6' src="\public\icons\search.png" alt="search" />
                </div>
                {userIds.map(
                    (id) => {
                        const user = allUsers[id];
                        let isUserAdded = false;
                        if (isForAddDelete && curentGroupUsers[user.id]) {
                            isUserAdded = true;
                        }
                        return (
                            (user.name.includes(search) || user.email.includes(search)) && !(isForAddDelete && id === curentUser?.id) && <div key={user.id}>

                                <div className={`flex gap-3 justify-between items-center p-2 cursor-pointer hover:bg-red-600 rounded transition-all duration-200 ease-in-out `}
                                    onClick={() => {
                                    }}>
                                    <div className="flex gap-3 items-center p-2">
                                        <div className="rounded-full bg-green-500 w-10 p-1 font-bold">
                                            <img src="\public\icons\user.png" alt="user" />
                                        </div>
                                        <div className="">
                                            <h4 className='text-lg'>{user.name}</h4>
                                            <i className='text-sm'>{user.email}</i>
                                        </div>
                                    </div>
                                    {isForAddDelete ?
                                        <div className={`mr-2 ${isUserAdded ? "hover:bg-red-400" : "hover:bg-green-400"} p-2 w-10 text-3xl rounded`} onClick={() => isUserAdded ? deleteUser(user.id) : addUser(user.id)}>{
                                            isUserAdded ?
                                            <img src="\public\icons\delete.png" alt="delete" />                                            :
                                            <img src="\public\icons\add-friend.png" alt="add" />                                            }</div>
                                        : <div className="mr-2 hover:bg-green-500 p-2 w-10 rounded" onClick={() => handlePersonalMsg(user.id)}>
                                                <img src="\public\icons\chat.png" alt="masssge" />
                                        </div>}
                                </div>
                                <hr />
                            </div>
                        )
                    }
                )}

            </div>


        </div>)
}
