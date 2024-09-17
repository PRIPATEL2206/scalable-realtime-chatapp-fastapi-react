import { ChangeEvent, useEffect, useState } from 'react'
import { useAuth } from '../../../hooks/auth-provider';
import { Group } from '../../../models/group-model';
import { useGroup } from '../../../hooks/group-provider';

export default function GroupUsersSideBar() {
    const { user: curentUser } = useAuth();
    const [userIds, setUserIds] = useState<string[]>([]);
    const [search, setSearch] = useState("")
    const { createGroup, groups, addUser, setCurentGroup, curentGroupUsers, curentGroup } = useGroup();


    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }

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
    }

    useEffect(() => {

        setUserIds(_ids => [])
        for (const ke in curentGroupUsers) {
            setUserIds(ids => [...ids, ke])
        }

    }, [curentGroupUsers])

    return (
        <div id='chat-sidebar' className='relative w-full  bg-green-400 rounded overflow-y-auto no-scrollbar'>

            <div className="p-10 flex-1 flex flex-col">
                <div className="rounded-lg p-3 flex w-1/3 self-end  bg-white mb-3">
                    <input type="text" className='flex-1 outline-none text-black' placeholder='search' onChange={handleSearchChange} />
                    <img className='w-6' src="\public\icons\search.png" alt="search" />
                </div>

                {userIds.map(
                    (id) => {
                        const user = curentGroupUsers[id];
                        const isAdmin = curentGroup?.createdBy === user.id;
                        return (user.name.includes(search) || user.email.includes(search)) && (
                            <div key={user.id}>

                                <div className="flex gap-3 justify-between items-center p-2 cursor-pointer hover:bg-red-600 rounded transition-all duration-200 ease-in-out "
                                    onClick={() => {
                                    }}>
                                    <div className="flex gap-3 items-center p-2">
                                        <div className="rounded-full bg-green-500 p-2 w-10 font-bold">
                                            <img src="\public\icons\user.png" alt="masssge" />
                                        </div>
                                        <div className="">
                                            <h4 className='text-lg'>{user.name + isAdmin ? " (Admin)" : ""}</h4>
                                            <i className='text-sm'>{user.email}</i>
                                        </div>
                                    </div>

                                    <div className="mr-2 hover:bg-green-500 p-2 w-10 rounded" onClick={() => handlePersonalMsg(user.id)}>
                                        <img src="\public\icons\chat.png" alt="masssge" />
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
