import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "../services/Supabase";
import type { Session } from "@supabase/supabase-js";

type AuthContextType = {
  session: Session | null;
  signUp: (email: string, password: string) => void;
  logIn: (email: string, password: string) => void;
  logOut: () => void;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.log("There was a problem signing up: ", error);
      return { success: false, error };
    }

    return { success: true, data };
  };

  const logIn = async(email: string, password: string) => {
    const {data, error} = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    })

    if(error){
        console.log("An error occured while loggin in: ", error);
        return {success: false, error: error.message}
    }

    return {success: true, data};
  }

  const logOut = async () => {
    const {error} = await supabase.auth.signOut();

    if (error) {
      console.log("There was a problem logging out: ", error);
      return { success: false, error };
    }
  }

  useEffect(() => {
    if(session != null){
        supabase.auth.getSession().then(({data: {session}}) => {
        return setSession(session);
    })
    }

    supabase.auth.onAuthStateChange((_event, session) => {
        return setSession(session);
    })
  }, [])

  return (
    <AuthContext.Provider value={{ session, signUp, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  const context = useContext(AuthContext);
  if(context === undefined){
    throw new Error("UserAuth must be used within an AuthContextProvider");
  }
  return context;
}
