import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
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
  getNumOfLectures: (classId: string) => Promise<number>;
  getNumOfAssignments: (classId: string) => Promise<number>;
};

const TableContext = createContext<TableContextType | undefined>(undefined);

export const TableContextProvider = ({ children }: { children: ReactNode }) => {
  const [classes, setClassses] = useState<ClassesType[]>([]);

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
      .insert([
        { class_name: nameOfClass, class_creator: currentSession.user.id },
      ])
      .select();

    console.log("Supabase insert result:", { data, error });

    if (error) {
      console.log("Error adding class: ", error);
      return { success: false, error };
    }

    return { success: true, data };
  };

  const getClasses = async () => {
    const {
      data: { session: currentSession },
    } = await supabase.auth.getSession();

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

    setClassses(data);
    return { success: true, data };
  };

  const getNumOfLectures = async (classId: string) => {
    const { count, error } = await supabase
      .from("Class Lectures")
      .select("*", { count: "exact", head: true })
      .eq("class_id", classId);

    if (error) {
      console.log("Error getting lecture count: ", error);
      return 0;
    }

    return count ?? 0;
  };

  const getNumOfAssignments = async (classId: string) => {
    const { count, error } = await supabase
      .from("Class Assignments")
      .select("*", { count: "exact", head: true })
      .eq("class_id", classId);

    if (error) {
      console.log("Error getting lecture count: ", error);
      return 0;
    }

    return count ?? 0;
  };

  return (
    <TableContext.Provider
      value={{
        classes,
        getClasses,
        addClass,
        getNumOfLectures,
        getNumOfAssignments,
      }}
    >
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
