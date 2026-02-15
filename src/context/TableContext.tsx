import { createContext, useContext, type ReactNode } from "react";
import { supabase } from "../services/Supabase";
import { UserAuth } from "./AuthContext";

type TableResult = {
    success: boolean;
    error?: any;
    data?: any;
}

type TableContextType = {
  addClass: (
    nameOfClass: string,
  ) => Promise<TableResult>;
};

const TableContext = createContext<TableContextType | undefined>(undefined);

export const TableContextProvider = ({ children }: { children: ReactNode }) => {
  const { session } = UserAuth();

  const addClass = async (
    nameOfClass: string,
  ) => {
    if(!session?.user?.id) {
        return {
            success: false,
            error: "User not authenticated",
        };
    }
    
    const { data, error } = await supabase
      .from("Classes")
      .insert([{ class_name: nameOfClass, classCreator: session.user.id }]);

    if(error) {
        console.log("Error adding class: ", error);
        return {success: false, error};
    }

    return {success: true, data};
  };

  return (
    <TableContext.Provider value={{ addClass }}>
      {children}
    </TableContext.Provider>
  );
};

export const tableInserterAndRemover = () => {
    const context = useContext(TableContext);
    if(context === undefined) {
        throw new Error("tableInserterAndRemover must be within TableContextProvider");
    }
    return context;
}
