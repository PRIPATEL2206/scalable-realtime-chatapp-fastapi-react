import { useAuth } from '@/hooks/auth-provider'
import { useGroup } from '@/hooks/group-provider';
import { tost } from '@/hooks/tost-provider';
import { User } from '@/models/user-model'
import { streamDataFromReader } from '@/utils/stream-data';
import React, { useEffect, useState } from 'react'

export default function AllUsersSideBar({ isForAddDelete = false }: { isForAddDelete?: boolean }) {
    const [users, setUsers] = useState<User[]>([])
    const { user } = useAuth();
    const { addUser } = useGroup();


    const deleteUser = (userId: string) => {

    }

    const fetchUsers = async () => {

        try {
            const response = await fetch("http://127.0.0.1:8000/auth/users", {
                method: "post",
                headers: {
                    accept: "application/json",
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": `Bearer ${user?.access_token}`
                },
            });

            if (response.status !== 200) {
                const error = await response.json()
                console.log(error)
                tost.error(error)
            }
            setUsers(u => [])
            streamDataFromReader(
                {
                    reader: response.body!.getReader(),
                    onData: (data) => {
                        const user = new User(JSON.parse(data))
                        setUsers(users => [...users, user])
                    },

                }
                ,)
        }
        catch (e: any) {
            console.log(e)
            tost.error(e)
        }

    }

    useEffect(() => {
        fetchUsers()

    }, [])
    
    return (
        <div id='chat-sidebar' className='relative w-full  bg-green-400 rounded overflow-y-scroll '>
            {!isForAddDelete && <div className="sticky w-full top-0 bg-red-400 p-2 min-h-14 rounded flex gap-3 items-center justify-center shadow-lg cursor-pointer" >
                <h5>All Users</h5>
            </div>
            }
            <div className={`p-10 ${isForAddDelete ? "" : "my-10"} flex-1`}>

                {users.map(
                    user => {
                        return (
                            <div key={user.id}>

                                <div className={`flex gap-3 justify-between items-center p-2 cursor-pointer hover:bg-red-600 rounded transition-all duration-200 ease-in-out `}
                                    onClick={() => {
                                    }}>
                                    <div className="flex gap-3 items-center p-2">
                                        <div className="rounded-full bg-green-500 px-4 py-2 font-bold">{user.name.charAt(0).toUpperCase()}</div>
                                        <div className="">
                                            <h4 className='text-lg'>{user.name}</h4>
                                            <i className='text-sm'>{user.email}</i>
                                        </div>
                                    </div>
                                    {isForAddDelete ?
                                        <div className="mr-2 hover:bg-green-500 px-2 text-3xl rounded" onClick={() => addUser(user.id)}>+</div>
                                        : <div className="mr-2 hover:bg-green-500 px-2 py-3 rounded">Massage</div>}
                                </div>
                                <hr />
                            </div>
                        )
                    }
                )}
            </div>


        </div>)
}
