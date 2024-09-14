import React, { useState } from 'react'
import { useAuth } from '../../hooks/auth-provider';
import { getDataFromFormEvent } from '../../utils/form-utils';
import { tost } from '../../hooks/tost-provider';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {

    const [isLoding, setIsLoding] = useState(false);
    const { login } = useAuth()
    const navigate = useNavigate()

    function handleSubmit(form: React.FormEvent<HTMLFormElement>) {
        form.preventDefault()
        setIsLoding(true)
        const { email, password } = getDataFromFormEvent(form)
        login({
            email,
            password
        })
            .then(value => {
                tost.sucsess("login successsull");
                console.log("login ", value);
                navigate("/chats")
            })
            .catch(error =>
                tost.error(error.message)
            )
            .finally(() => {
                setIsLoding(false)
            })
    }

    return (
        <div className='flex w-screen h-fit justify-center mt-20 '>
            <div className='w-1/3 h- bg-red-50 text-black p-5 rounded-md'>
                <h1 className='text-2xl'>Login</h1>
                <form onSubmit={handleSubmit}>

                    <div className="flex flex-col mt-3">
                        <label htmlFor="email">Email : </label>
                        <input type="" placeholder='abc@xyz.com' name='email' id='email' className='p-1 border-black border-2  rounded-lg' />
                    </div>
                    <div className="flex flex-col mt-3">
                        <label htmlFor="password">Password : </label>
                        <input type="password" placeholder='******' name='password' id='password' className='p-1 border-black border-2  rounded-lg' />
                    </div>
                    <div className="flex flex-col mt-5">
                        <input type="submit" value={isLoding ? "Loding..." : "Login"} disabled={isLoding} className='p-1 border-black border-2  rounded-lg font-bold hover:bg-black hover:text-white' />
                    </div>
                </form>

                <div className='float-end text-sm mt-3'>
                    <span>don't have account? <Link className='text-blue-600' to='/register' >Register here</Link> </span>
                </div>
                <Link to='/chats'>home</Link>

            </div>
        </div>
    )
}
