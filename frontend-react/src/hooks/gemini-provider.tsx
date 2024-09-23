import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { Chat } from "../models/chat-model";
import { useAuth } from "./auth-provider";

interface GeminiContextInterface {
    sendPrompt: (prompt: string) => void
    chats:Chat[]
}

const GeminiContext = createContext<GeminiContextInterface | undefined>(undefined);


const useGemini = () => {
    const context = useContext(GeminiContext);
    if (context === undefined) {
      throw new Error("useGemini must most be use with in a GeminiProvider");
    }
    return context;
  }

interface GeminiPropsInterface {
    children: ReactNode,
    ws?: WebSocket

}

const GeminiProvider: React.FC<GeminiPropsInterface> = ({ children, ws }) => {
    const [chats, setChats] = useState<Chat[]>([]);
    const { user } = useAuth();

    useEffect(() => {
        if (ws) {
            ws.onmessage = (e) => {
                const msg = JSON.parse(e.data)
                console.log(msg)
                if (msg.event === "massage_recive") {
                    const chat = new Chat({
                        group_id: "jemin",
                        id: "gemini",
                        sender_id:  "gemini",
                        ...JSON.parse(msg.data.chat)
                    })
                    console.log(chat)
                    console.log(msg.data.chat)
                    setChats(pre => [...pre, chat])
                }
    
            }
        }

    }, [ws])

    const sendPrompt = (prompt: string) => {
        ws?.send(JSON.stringify({
            "event": "massage_send",
            "data": {
                prompt
            }
        }));
        const chat = new Chat({
            group_id: "jemin",
            id: "gemini",
            msg: prompt,
            sender_id: user?.id ?? "",
            created_at: (new Date().toISOString())
        })
        setChats(pre => [...pre, chat])
    }

    return <GeminiContext.Provider value={{ sendPrompt ,chats}}>
        {children}
    </GeminiContext.Provider>
}



export { GeminiProvider ,useGemini}