import { useEffect, useState } from 'react'
import { useAuth } from '../../../hooks/auth-provider'
import { GeminiProvider } from '../../../hooks/gemini-provider'
import GeminiConsole from './gemini-chats';

export default function GeminiWraper() {
  const { user } = useAuth()


  let [ws, setWS] = useState<WebSocket>();
  useEffect(() => {
    if (ws === undefined) {
      setWS(new WebSocket("ws://localhost:8000/gemini/chat"));
    }
  }, [])

  useEffect(() => {
    if (ws) {
      ws.onopen = () => {
        console.log("conected")
        ws?.send(JSON.stringify({
          event: "Authorization",
          data: { Authorization: user?.access_token, }
        }))
      }
    }

  }, [ws])




  return (
    <GeminiProvider ws={ws!}>
      <div id='chat-sidebar' className='relative flex-1 bg-green-400 rounded flex flex-col'>
        <div className="sticky w-full bg-red-400 p-2 min-h-14 rounded flex gap-3 items-center justify-between shadow-lg cursor-pointer"  >
          <div className="flex gap-3 items-center " >
            <div className="rounded-full bg-green-500 w-10 p-2">
              <img src="\public\icons\gemini.png" alt="Gemini" />
            </div>
            <h5>Gemini</h5>
          </div>
        </div>
        <GeminiConsole />
      </div>
    </GeminiProvider>
  )
}
