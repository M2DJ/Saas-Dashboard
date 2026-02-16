import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import { supabase } from "../services/Supabase";
import { UserAuth } from "./AuthContext";

type TableResult = {
  success: boolean;
  error?: any;
  data?: any;
};

type TableContextType = {
  addClass: (nameOfClass: string) => Promise<TableResult>;
  getClasses: () => Promise<TableResult>;
};

const TableContext = createContext<TableContextType | undefined>(undefined);

export const TableContextProvider = ({ children }: { children: ReactNode }) => {
  

  const { session } = UserAuth();

  useEffect(() => {
    console.log("session changed");
  }, [session]);

  const addClass = async (nameOfClass: string) => {
    const {
      data: { session: currentSession },
    } = await supabase.auth.getSession();

    if (!currentSession?.user?.id) {
      return {
        success: false,
        error: "User not authenticated",
      };
    }

    console.log("✅ PASSED: User is authenticated, inserting...");

    const { data, error } = await supabase
      .from("Classes")
      .insert([{ class_name: nameOfClass, class_creator: currentSession.user.id }])
      .select();

    console.log("Supabase insert result:", { data, error });

    if (error) {
      console.log("Error adding class: ", error);
      return { success: false, error };
    }

    return { success: true, data };
  };

  const getClasses = async () => {
    const { data: { session: currentSession } } = await supabase.auth.getSession();

    if (!currentSession?.user?.id) {
      return {
        success: false,
        error: "User not authenticated",
      };
    }

    const { data, error } = await supabase
      .from("Classes")
      .select("*")
      .eq("class_creator", currentSession.user.id);

    if (error) {
      console.log("Error fetching classes: ", error);
      return { success: false, error };
    }

    return { success: true, data };
  };

  return (
    <TableContext.Provider value={{ getClasses, addClass }}>
      {children}
    </TableContext.Provider>
  );
};

export const tableInserterAndRemover = () => {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error(
      "tableInserterAndRemover must be within TableContextProvider",
    );
  }
  return context;
};
