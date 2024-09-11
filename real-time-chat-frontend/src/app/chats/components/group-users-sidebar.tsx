import { useAuth } from '@/hooks/auth-provider'
import { useGroup } from '@/hooks/group-provider';
import { Group } from '@/models/group-model';
import React, { useEffect, useState } from 'react'

export default function GroupUsersSideBar() {
    const { user: curentUser } = useAuth();
    const [userIds, setUserIds] = useState<string[]>([]);
    const { createGroup, groups, addUser, setCurentGroup, curentGroupUsers } = useGroup();

    const handlePersonalMsg = async (userId: string) => {
        let chatWithUser: Group | undefined = groups.filter(group => group.is_individual_group).find((group) => group.name === userId);
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

        setUserIds(ids => [])
        for (const ke in curentGroupUsers) {
            setUserIds(ids => [...ids, ke])
        }

    }, [curentGroupUsers])

    return (
        <div id='chat-sidebar' className='relative w-full  bg-green-400 rounded overflow-y-auto '>

            <div className="p-10 flex-1">


                {userIds.map(
                    (id) => {
                        const user = curentGroupUsers[id];
                        return (
                            <div key={user.id}>

                                <div className="flex gap-3 justify-between items-center p-2 cursor-pointer hover:bg-red-600 rounded transition-all duration-200 ease-in-out "
                                    onClick={() => {
                                    }}>
                                    <div className="flex gap-3 items-center p-2">
                                        <div className="rounded-full bg-green-500 px-4 py-2 font-bold">{user.name.charAt(0).toUpperCase()}</div>
                                        <div className="">
                                            <h4 className='text-lg'>{user.name}</h4>
                                            <i className='text-sm'>{user.email}</i>
                                        </div>
                                    </div>

                                    <div className="mr-2 hover:bg-green-500 px-2 py-3 rounded" onClick={() => handlePersonalMsg(user.id)}>Massage</div>
                                </div>
                                <hr />
                            </div>
                        )
                    }
                )}

            </div>


        </div>)
}
