'use client'
import { getDataFromFormEvent } from '@/utils/form-utils'
import Link from 'next/link'
import React, { FormEvent, FormEventHandler, useState } from 'react'
import { User } from '../models/user-model';

export default function login() {

    const [isLoding, setIsLoding] = useState(false);

    function handleSubmit(form: React.FormEvent<HTMLFormElement>) {
        form.preventDefault()
        setIsLoding(true)
        const { email, password } = getDataFromFormEvent(form)
        fetch("http://127.0.0.1:8000/auth/login",
            {
                method: "post",
                headers: {
                    accept: "application/json",
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: `grant_type=password&username=${email}&password=${password}&scope=&client_id=string&client_secret=string`

            }
        ).then(async(data) => {
            if (data.status == 200) {
                console.log(await data.json()
                )
            }
            else{
                console.log("error",data)
            }
        }).finally(()=>{
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
                        <input type="submit" value={isLoding?"Loding...":"Login"} disabled={isLoding} className='p-1 border-black border-2  rounded-lg font-bold hover:bg-black hover:text-white' />
                    </div>
                </form>

                <div className='float-end text-sm mt-3'>
                    <span>don't have account? <Link className='text-blue-600' href='/auth/register' >Register here</Link> </span>
                </div>

            </div>
        </div>
    )
}
