import { createContext, ReactNode } from "react"

interface GeminiContextInterface {
}

const GeminiContext = createContext<GeminiContextInterface | undefined>(undefined);

interface GeminiPropsInterface {
    children: ReactNode,
  ws: WebSocket

}

const GeminiProvider: React.FC<GeminiPropsInterface> = ({ children,ws }) => {
   
    return <GeminiContext.Provider value={{}}>
        {children}
    </GeminiContext.Provider>
}



export { GeminiProvider }