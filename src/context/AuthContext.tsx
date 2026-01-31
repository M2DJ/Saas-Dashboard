import { createContext, useContext, useState, type ReactNode } from "react";

type AuthContextType = {
    session: any;
    setSession: (session: any) => void;
}

type AuthContextProviderProps = {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({children}: AuthContextProviderProps) => {
    const [session, setSession] = useState(undefined);

    return (
        <AuthContext.Provider value={{session, setSession}}>
            {children}
        </AuthContext.Provider>
    );
}

export const UserAuth = () => useContext(AuthContext);