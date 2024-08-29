'use client'
import { getDataFromFormEvent } from '@/utils/form-utils';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

export default function register() {
    const [isLoding, setIsLoding] = useState(false);
    const router = useRouter();

    function handleSubmit(form: React.FormEvent<HTMLFormElement>) {
        form.preventDefault()
        setIsLoding(true)
        const { username, email, password } = getDataFromFormEvent(form)
        console.log(JSON.stringify({
            name: username,
            email: email,
            password: password
        }))
        fetch("http://127.0.0.1:8000/auth/register",
            {
                method: "post",
                headers: {
                    accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: username,
                    email: email,
                    password: password
                })
            }
        ).then(async (data) => {
            if (data.status == 200) {
                console.log(await data.json()
                )
            }
            else{
                console.log("error",data)
            }
        }).finally(() => {
            setIsLoding(false)
        })
    }

    return (
        <div className='flex w-screen h-fit justify-center mt-20 '>
            <div className="w-1/3  bg-red-50 text-black p-5 rounded-md">
                <h1 className='text-2xl'>Register</h1>
                <form onSubmit={handleSubmit}>

                    <div className="flex flex-col mt-3">
                        <label htmlFor="username">User Name : </label>
                        <input type="text" placeholder='abc123' name='username' id='username' className='p-1 border-black border-2  rounded-lg' />
                    </div>
                    <div className="flex flex-col mt-3">
                        <label htmlFor="email">Email : </label>
                        <input type="" placeholder='abc@xyz.com' name='email' id='email' className='p-1 border-black border-2  rounded-lg' />
                    </div>
                    <div className="flex flex-col mt-3">
                        <label htmlFor="password">Password : </label>
                        <input type="password" placeholder='******' id='password' name='password' className='p-1 border-black border-2  rounded-lg' />
                    </div>
                    <div className="flex flex-col mt-5 ">
                        <input type="submit" value={isLoding ? "Loding..." : "Register"} disabled={isLoding} className='p-1 border-black border-2  rounded-lg font-bold hover:bg-black hover:text-white' />
                    </div>
                </form>

                <div className='float-end text-sm mt-3'>
                    <span>Already have account? <Link className='text-blue-600' href='/auth/login' >Login here</Link> </span>
                </div>
            </div>
        </div>
    )
}
