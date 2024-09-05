import { User } from '@/models/user-model';
import { redirect } from 'next/navigation';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

interface AuthContextInterface {
    user: User | null
    isLogin: boolean
    login: ({ email, password }: { email: string, password: string }) => Promise<boolean>
    register: ({ email, password, name }: { email: string, password: string, name: string }) => Promise<boolean>
    logout: () => void
}
const AuthContext = createContext<AuthContextInterface | undefined>(undefined);

const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must most be use with in a AuthProvider");
    }
    return context;
}
const isUserLogin = () => {
    return localStorage.getItem("curentUser") !== null
}

interface AuthPropsInterface {
    children: ReactNode,

}
const AuthProvider: React.FC<AuthPropsInterface> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLogin, setIsLogin] = useState<boolean>(false);

    const getRefreshTocken = async (reftoken: string) => {
        const response = await fetch("http://127.0.0.1:8000/auth/refresh-token", {
            method: "post",
            headers: {
                accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                refresh_token:reftoken
            })
        });
        if (response.status !== 200) {
            throw Error(`${await response.json()}`)
        }
        const data = await response.json()
        return new User({ ...data, ...data["user"] })
    }

    useEffect(() => {
        const userString = localStorage.getItem("curentUser");
        if (userString !== null) {
            const newUser = new User(JSON.parse(userString));
            getRefreshTocken(newUser.refresh_token).then(user => {
                setUser(user);
                setIsLogin(true);
            }).catch(
                e => {
                    console.log(e)
                    logout()
                }
            )
        }
    }, []);
    useEffect(() => {
        setIsLogin(user !== null)
        if (user) {
            localStorage.setItem("curentUser", JSON.stringify(user.toJson()))
            return
        }
        if (localStorage.getItem("curentUser") !== null) {
            localStorage.removeItem("curentUser")
        }
    }, [user])

    const login = async ({ email, password }: { email: string, password: string }) => {
        const response = await fetch("http://127.0.0.1:8000/auth/login",
            {
                method: "post",
                headers: {
                    accept: "application/json",
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: `grant_type=password&username=${email}&password=${password}&scope=&client_id=string&client_secret=string`

            }
        )
        if (response.status == 200) {
            const data = await response.json();
            setUser(new User({ ...data, ...data["user"] }));
            return true;
        }
        // console.log(await response.json())
        throw new Error(JSON.stringify(await response.json()));
    }

    const register = async ({ name, email, password }: { name: string, email: string, password: string }) => {
        const response = await fetch("http://127.0.0.1:8000/auth/register",
            {
                method: "post",
                headers: {
                    accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            }
        )
        if (response.status === 200) {
            console.log("register sucssessfull", await response.json())
            return true
        }
        throw new Error(JSON.stringify(await response.json()))

    }

    const logout = () => {
        setUser(null);
    }
    return <AuthContext.Provider value={{ user, isLogin, login, register, logout }}>
        {children}
    </AuthContext.Provider>
}

function authRequired<T>(Component: (props: T) => React.JSX.Element) {
    const innerauthReq = (props: T) => {
        const { isLogin } = useAuth();

        if (!isLogin) {
            return redirect("/auth/login")
        }
        return Component(props)
    }
    return innerauthReq

}



export { useAuth, AuthProvider, isUserLogin, authRequired as loginRequired }