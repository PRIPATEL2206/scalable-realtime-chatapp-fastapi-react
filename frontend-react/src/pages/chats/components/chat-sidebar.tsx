
import { useAuth } from '../../../hooks/auth-provider';
import { useGroup } from '../../../hooks/group-provider';
import { Link, Outlet, useLocation } from 'react-router-dom';

export default function ChatSideBar() {
  // const [show, setShow] = useState<"chat" | "add-user" | 'group-user'|"nothing">("chat");
  // const [component, setComponent] = useState<ReactNode>();

  const { curentGroup, curentGroupUsers, deleteUser } = useGroup()
  const { user } = useAuth()

  // useEffect(() => {
  //   if (curentGroup) {
  //     setShow("chat")
  //     return
  //   }
  //   setShow("nothing")
  // }, [curentGroup])



  // useEffect(() => {
  //   switch (show) {
  //     case 'add-user':
  //       setComponent(<AllUsersSideBar isForAddDelete={true} />)
  //       break;
  //     case 'group-user':
  //       setComponent(<GroupUsersSideBar />)
  //       break;
  //     case 'chat':
  //       setComponent(<ChatsConsole />)
  //       break;

  //     default:
  //       setComponent(undefined)
  //       break;
  //   }
  // }, [show])

  const location = useLocation()

  return (
    <div id='chat-sidebar' className='relative flex-1 bg-green-400 rounded flex flex-col'>
      <div className="sticky w-full bg-red-400 p-2 min-h-14 rounded flex gap-3 items-center justify-between shadow-lg cursor-pointer" >
        {curentGroup && <>
          <div className="flex gap-3 items-center " >
            <div className="rounded-full bg-green-500 px-4 py-2">{(curentGroup.isIndividualGroup && curentGroupUsers[curentGroup.name] ? curentGroupUsers[curentGroup.name].name : curentGroup.name).charAt(0).toUpperCase()}</div>
            <h5>{curentGroup.isIndividualGroup && curentGroupUsers[curentGroup.name] ? curentGroupUsers[curentGroup.name].name : curentGroup.name}</h5>
          </div>
          {
            location.pathname.includes("add-users") ?
              <Link to={`/chats/${curentGroup.id}`} className="px-2  hover:bg-green-500  rounded-lg  mr-3 text-3xl "  >X</Link>
              :
              !curentGroup.isIndividualGroup &&
              (curentGroup.createdBy === user?.id ?
                <Link to={`/chats/${curentGroup.id}/add-users`} className="px-2  hover:bg-green-500  rounded-lg  mr-3 text-3xl "  >+</Link>
                : <Link to={`/chats`} className='p-2  hover:bg-red-500  rounded-lg  mr-3 text-xl' onClick={() => deleteUser(user!.id, curentGroup.id)}>leave</Link>
              )}
        </>}
      </div>
      <Outlet />

    </div>
  )
}

