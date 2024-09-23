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
      <GeminiConsole />
    </GeminiProvider>
  )
}
