
import { useAuth } from '../../../hooks/auth-provider';
import { useGroup } from '../../../hooks/group-provider';
import { Link, Outlet, useLocation } from 'react-router-dom';

export default function ChatSideBar() {

  const { curentGroup, curentGroupUsers, deleteUser } = useGroup()
  const { user } = useAuth()


  const location = useLocation()

  return (
    <div id='chat-sidebar' className='relative flex-1 bg-green-400 rounded flex flex-col'>
      <Link to={curentGroup?.isIndividualGroup?"": `/chats/${curentGroup?.id}/users`}  className="sticky w-full bg-red-400 p-2 min-h-14 rounded flex gap-3 items-center justify-between shadow-lg cursor-pointer"  >
        {curentGroup && <>
          <div className="flex gap-3 items-center " > 
            <div className="rounded-full bg-green-500 w-10 p-2">
              {
                curentGroup.isIndividualGroup?
                <img src="\public\icons\user.png" alt="create group" />:
                 <img src="\public\icons\group.png" alt="create group" />
              }
            </div>
            <h5>{curentGroup.isIndividualGroup && curentGroupUsers && curentGroupUsers[curentGroup.name] ? curentGroupUsers[curentGroup.name].name : curentGroup.name}</h5>
          </div>
          {
            location.pathname.includes("add-users") ?
              <Link to={`/chats/${curentGroup.id}`} className="p-2 w-10 hover:bg-green-500  rounded-lg  mr-3 text-3xl "  >
                                      <img src="\public\icons\back.png" alt="user" /> 

              </Link>
              :
              !curentGroup.isIndividualGroup &&
              (curentGroup.createdBy === user?.id ?
                <Link to={`/chats/${curentGroup.id}/add-users`} className="p-2 w-10  hover:bg-green-500  rounded-lg  mr-3 text-3xl "  >
                                        <img src="\public\icons\add-friend.png" alt="user" /> 

                </Link>
                : <Link to={`/chats`} className='p-2  hover:bg-red-500  rounded-lg  mr-3 text-xl' onClick={() => deleteUser(user!.id, curentGroup.id)}>leave</Link>
              )}
        </>}
      </Link>
      <Outlet />

    </div>
  )
}

