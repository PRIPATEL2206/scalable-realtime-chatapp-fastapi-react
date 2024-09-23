import { useState } from "react";
import { useAuth } from "../../hooks/auth-provider"
import { getDataFromFormEvent } from "../../utils/form-utils";
import { tost } from "../../hooks/tost-provider";

export default function ProfilePage() {
  const { user, logout , updateUser } = useAuth();
  const [isEdited,setEdited] = useState(false)
  const handleEdit = (form: React.FormEvent<HTMLFormElement>) => {
    form.preventDefault()
    const {username} = getDataFromFormEvent(form);
    updateUser({username}).then(
      _=>tost.sucsess("Updated sucsessfuly")
    ).catch(
      e=>tost.error(e)
      )
  }

  return (
    <div id='chat-sidebar' className='relative flex-1  bg-green-400 rounded flex gap-3 items-center  flex-col overflow-y-auto no-scrollbar '>
      <div className="sticky w-full top-0 bg-red-400 p-2 min-h-14 rounded flex gap-3 items-center justify-center shadow-lg" >
        <h5>{user?.name}</h5>
      </div>
      <div className="border-white border-4 rounded-full p-1">
        <img src="\public\icons\user.png" alt="profile" />
      </div>
      <h6 className="text-xs">{user?.id}</h6>
      <form className="bg-green-300 w-1/2 p-3 rounded-lg flex flex-col gap-3" onChange={()=>setEdited(true)} onSubmit={handleEdit}>
        <div className="flex">

          <h3 className="w-16">Name :</h3>
          <input name="username"  className="bg-inherit p-1 border ml-2 focus:outline w-full" type="text" defaultValue={user?.name} />
        </div>
        <div className="flex">

          <h3 className="w-16">Email :</h3>
          <input name="email" disabled className="bg-inherit p-1 ml-2 focus:outline-none w-full" type="text" defaultValue={user?.email} />
        </div>
        { isEdited &&<button className="bg-green-400 py-1  hover:bg-green-500">save</button>}
      </form>
      <button className="items-center hover:bg-red-500 bg-red-400 p-3 flex gap-3" onClick={logout}>
        <h5>logout</h5>
        <img className="w-5" src="\public\icons\logout.png" alt="" />
      </button>
    </div>
  )
}
