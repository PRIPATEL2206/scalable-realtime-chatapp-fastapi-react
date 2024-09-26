import { ChangeEvent, useEffect, useState } from 'react'
import { useAuth } from '../../../hooks/auth-provider';
import { Group } from '../../../models/group-model';
import { useGroup } from '../../../hooks/group-provider';
import { getDataFromFormEvent } from '../../../utils/form-utils';
import { tost } from '../../../hooks/tost-provider';

export default function GroupUsersSideBar() {
    const { user: curentUser } = useAuth();
    const [userIds, setUserIds] = useState<string[]>([]);
    const [search, setSearch] = useState("")
    const { createGroup,updateGroup, groups, addUser, setCurentGroup, curentGroupUsers, curentGroup } = useGroup();
    const [isEdited, setIsEdited] = useState(false);

    const handleEdit = (form: React.FormEvent<HTMLFormElement>) => {
        form.preventDefault()
        const { name , des } = getDataFromFormEvent(form);
        curentGroup?.toJson()
        const updatedGroup=new Group({...curentGroup!.toJson(),...{name,des}})
        updateGroup(updatedGroup).then(
            _ => tost.sucsess("Updated sucsessfuly")
        ).catch(
            e => tost.error(e)
        )
    }

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

                <div id='chat-sidebar' className='relative flex-1 mb-10 bg-green-400 rounded flex gap-3 items-center  flex-col overflow-y-auto no-scrollbar '>

                    <div className="border-white border-4 w-24 p-2 rounded-full ">
                        <img src="\public\icons\group.png" alt="profile" />
                    </div>
                    <h6 className="text-xs">{curentUser?.id}</h6>
                    <form className="bg-green-300 w-1/2  p-3 rounded-lg flex flex-col gap-3" onChange={() => setIsEdited(true)} onSubmit={handleEdit}>
                        <div className="flex">

                            <h3 className="w-36">Group Name :</h3>
                            <input name="name" className="bg-inherit p-1 border ml-2 focus:outline w-full" type="text" defaultValue={curentGroup?.name} />
                        </div>
                        <div className="flex">

                            <h3 className="w-36 ">Description :</h3>
                            <textarea name="des" className="bg-inherit p-1 ml-2 border focus:outline w-full" defaultValue={curentGroup?.des} >
                            </textarea>
                        </div>
                        {isEdited && <button className="bg-green-400 py-1  hover:bg-green-500" >save</button>}
                    </form>
                </div>
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
