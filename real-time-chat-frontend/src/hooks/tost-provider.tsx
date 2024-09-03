import { createContext, ReactNode, useState } from "react"

interface TostContextInterface {


}

let showTost: ((title: string,subTitle: string | null, color: "green" | "yellow" | "red") => void) | null = null

const TostContext = createContext<TostContextInterface | undefined>(undefined);

interface TostPropsInterface {
    children: ReactNode
}

interface MsgInterface {
    color: "green" | "yellow" | "red"
    title: string
    subTitle: string | null
}
const TostProvider: React.FC<TostPropsInterface> = ({ children }) => {
    const [msgs, setMsg] = useState<MsgInterface[]>([]);

    showTost = (title,subTitle, color) => {
        setMsg(msgs => [...msgs, {
            color: color,
            title: title,
            subTitle:subTitle

        }]);
        setTimeout(() => setMsg(msgs => msgs.slice(1)), 2000)
    }

    return <TostContext.Provider value={{}}>
        {msgs.length > 0 &&
            <div style={{ position: "absolute", top: "10px", right: "10px" }} className="absolute top-1 right-1">
                {msgs.map((msg,i) =>
                    <div key={i}
                        className={`bg-${msg.color}-700 `}>
                        {msg.title}
                    </div>
                )}
            </div>
        }
        {children}
    </TostContext.Provider>
}

const tost = {
    sucsess: (title: string, subTitle:string | null= null) => {
        if (showTost === null) {
            throw Error("tost must most be use with in a TostProvider")
        }
        showTost(title,subTitle, "green");
    },
    error: (title: string, subTitle:string | null= null)  => {
        if (showTost === null) {
            throw Error("tost must most be use with in a TostProvider")
        }
        showTost(title,subTitle, "red");

    },
    info: (title: string, subTitle:string | null= null)  => {
        if (showTost === null) {
            throw Error("tost must most be use with in a TostProvider")
        }
        showTost(title,subTitle, "yellow");
    },
    
}


export { TostProvider, tost }