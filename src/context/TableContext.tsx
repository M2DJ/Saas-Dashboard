import { createContext, useContext, useState, type ReactNode } from "react";
import { supabase } from "../services/Supabase";
import { UserAuth } from "./AuthContext";
import type { ClassesType } from "../pages/ClassesPage";

type TableResult = {
  success: boolean;
  error?: any;
  data?: any;
};

type TableContextType = {
    classes: ClassesType[];
  addClass: (nameOfClass: string) => Promise<TableResult>;
  getClasses: () => Promise<TableResult>;
};

const TableContext = createContext<TableContextType | undefined>(undefined);

export const TableContextProvider = ({ children }: { children: ReactNode }) => {
  const [classes, setClassses] = useState<ClassesType[]>([]);

  const { session } = UserAuth();

  const addClass = async (nameOfClass: string) => {
    if (!session?.user?.id) {
      return {
        success: false,
        error: "User not authenticated",
      };
    }

    const { data, error } = await supabase
      .from("Classes")
      .insert([{ class_name: nameOfClass, class_creator: session.user.id }]);

    if (error) {
      console.log("Error adding class: ", error);
      return { success: false, error };
    }

    return { success: true, data };
  };

  const getClasses = async () => {
    if (!session?.user?.id) {
      return {
        success: false,
        error: "User not authenticated",
      };
    }

    const { data, error } = await supabase
      .from("Classes")
      .select("*")
      .eq("class_creator", session.user.id);
    
    if(error) {
        console.log("Error fetching classes: ", error);
        return {success: false, error};
    }

    setClassses(data);
    return {success: true, data};
  };

  return (
    <TableContext.Provider value={{ classes, getClasses, addClass }}>
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
