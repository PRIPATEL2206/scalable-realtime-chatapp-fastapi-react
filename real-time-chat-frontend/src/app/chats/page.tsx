'use client'
import { loginRequired, useAuth } from '@/hooks/auth-provider'
import { redirect, useRouter } from 'next/navigation'
import React from 'react'

const Chats = ()=> {
 
  return (
    <div>
      <h1>chats</h1>
    </div>
  )
}

export default loginRequired(Chats)
