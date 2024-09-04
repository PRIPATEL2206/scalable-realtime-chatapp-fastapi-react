'use client'
import { loginRequired, useAuth } from '@/hooks/auth-provider'
import { streamDataFromReader } from '@/utils/stream-data'
import axios from 'axios'
import React, { useEffect, useMemo } from 'react'


const Chats = () => {
  const { user,logout } = useAuth()
  let ws: WebSocket | null = null;


  
  // useEffect(() => {
  //   if (ws === null) {
  //     console.log("ok")

  //     ws = new WebSocket("ws://localhost:8000/chats/ws")
  //   }

  //   ws.onopen = (e) => {
  //     console.log("conected")
  //     ws?.send(JSON.stringify({
  //       event: "Authorization",
  //       data: { Authorization: user?.access_token, }
  //     }))
  //   }

  //   ws.onmessage = (e) => {
  //     console.log(e.data)
  //     const msg = JSON.parse(e.data)
  //     console.log(msg)
  //     console.log(JSON.parse(msg.data.chat))

  //   }

  // }, [user])

  useEffect(   () =>  {

  }, [])


  const handleClick = () => {
    // ws?.send(JSON.stringify({


    //   "event": "massage_send",
    //   "data": {
    //     "group_id": "eda91358-d880-436e-b0e5-39dc98738a06",
    //     "msg": "ok"
    //   }

    // }))
  }

  return (
    <div>
      <h1>user name {user?.name}</h1>
      <button onClick={handleClick}>send</button>
    </div>
  )
}

export default loginRequired(Chats)
