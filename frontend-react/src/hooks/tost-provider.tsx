import { createContext, ReactNode, useState } from "react"

interface TostContextInterface {


}

let showTost: ((title: string, subTitle: string | null, color: "green" | "yellow" | "red") => void) | null = null

const TostContext = createContext<TostContextInterface | undefined>(undefined);

interface TostPropsInterface {
    children: ReactNode
}

interface MsgInterface {
    bgColor: "green" | "yellow" | "red"
    title: string
    subTitle: string | null
}
const TostProvider: React.FC<TostPropsInterface> = ({ children }) => {
    const [msgs, setMsg] = useState<MsgInterface[]>([]);
    const bgColors = {
        "green": "bg-green-600",
        "red": "bg-red-600",
        "yellow": "bg-yellow-500"
    }
    showTost = (title, subTitle, color) => {
        setMsg(msgs => [...msgs, {
            bgColor: color,
            title: title,
            subTitle: subTitle
        }]);
        setTimeout(() => setMsg(msgs => msgs.slice(1)), 2000)
    }

    return <TostContext.Provider value={{}}>
        {msgs.length > 0 &&
            <div style={{ position: "absolute", top: "10px", right: "10px" }} className="absolute top-1 right-1">
                {msgs.map((msg, i) => {

                    return <div key={i}
                        className={`${bgColors[msg.bgColor]}  p-2 rounded-md min-w-52`}>
                        <h3>{msg.title}</h3>
                        <h5>{msg.subTitle}</h5>
                    </div>
                })}

            </div>
        }
        {children}
    </TostContext.Provider>
}

const tost = {
    sucsess: (title: string, subTitle: string | null = null) => {
        if (showTost === null) {
            throw Error("tost must most be use with in a TostProvider")
        }
        showTost(title, subTitle, "green");
    },
    error: (title: string, subTitle: string | null = null) => {
        if (showTost === null) {
            throw Error("tost must most be use with in a TostProvider")
        }
        showTost(title, subTitle, "red");

    },
    info: (title: string, subTitle: string | null = null) => {
        if (showTost === null) {
            throw Error("tost must most be use with in a TostProvider")
        }
        showTost(title, subTitle, "yellow");
    },

}


export { TostProvider, tost }