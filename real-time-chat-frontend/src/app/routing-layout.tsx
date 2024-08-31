import { useAuth } from '@/hooks/auth-provider'
import { redirect, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function RoutingLayout({ children }: { children: React.ReactNode }) {
  const {isLogin} = useAuth()
  const router = useRouter()
  useEffect(()=>{
    if(isLogin){
      router.push("/chats")
    }
  },[isLogin])
  return (
    <>
      {children}
    </>
  )
}
