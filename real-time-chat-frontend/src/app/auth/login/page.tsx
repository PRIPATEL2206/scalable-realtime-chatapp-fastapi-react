'use client'
import { getDataFromFormEvent } from '@/utils/form-utils'
import Link from 'next/link'
import React, { useState } from 'react'
import { useAuth } from '@/hooks/auth-provider';

export default function login() {

    const [isLoding, setIsLoding] = useState(false);
    const { login } = useAuth()

    function handleSubmit(form: React.FormEvent<HTMLFormElement>) {
        form.preventDefault()
        setIsLoding(true)
        const { email, password } = getDataFromFormEvent(form)
        login({
            email,
            password
        })
        .then(value => console.log("login ", value))
        .catch(error=>console.log(error))
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
                    <span>don't have account? <Link className='text-blue-600' href='/auth/register' >Register here</Link> </span>
                </div>
                <Link href={'/chats'}>home</Link>

            </div>
        </div>
    )
}
