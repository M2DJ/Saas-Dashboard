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
  data?: any | any[] | ClassesType[];
};

type TableContextType = {
  classes: ClassesType[];
  addClass: (nameOfClass: string) => Promise<TableResult>;
  getClasses: () => Promise<TableResult>;
  joinClass: (classId: string) => Promise<TableResult>;
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
      .select(
        `
      *,
      lectures:ClassLectures(count),
      assignments:ClassAssignments(count)
    `,
      )
      .eq("class_creator", currentSession.user.id);
    if (error) {
      console.log("Error fetching classes: ", error);
      return { success: false, error };
    }

    const { data: memberClasses, error: memberError } = await supabase
      .from("ClassMembers")
      .select(
        `
      class:Classes(
        *,
        lectures:ClassLectures(count),
        assignments:ClassAssignments(count)
      )
    `,
      )
      .eq("user_id", currentSession?.user.id);

    if (error || memberError) {
      console.log("Error fetching classes:", error || memberError);
      return { success: false, error: error || memberError };
    }

    //Extracting class data
    const memberClassesData = memberClasses?.map((item) => item.class) || [];

    const allClasses = [...(data || []), ...memberClassesData];

    const uniqueClasses = allClasses.filter(
      (classItem, index, self) =>
        index === self.findIndex((c) => c.class_id === classItem.class_id),
    );

    const classesWithCounts = uniqueClasses.map((classItem) => ({
      ...classItem,
      numOfLectures: classItem.lectures?.[0]?.count || 0,
      numOfAssignments: classItem.assignments?.[0]?.count || 0,
    }));

    setClassses(classesWithCounts);
    return { success: true, data: classesWithCounts };
  };

  const joinClass = async (classId: string) => {
    const {
      data: { session: currentSession },
    } = await supabase.auth.getSession();

    if (!currentSession?.user?.id) {
      return {
        success: false,
        error: "User not authenticated",
      };
    }

    const { data: classData, error: classError } = await supabase
      .from("Classes")
      .select("*")
      .eq("class_id", classId)
      .single();

    if (!classData || classError) {
      return {
        success: false,
        error: "Class was not found",
      };
    }

    const { data: existingMember } = await supabase
      .from("ClassMembers")
      .select("*")
      .eq("class_id", classId)
      .eq("user_id", currentSession?.user.id)
      .single();
    if (existingMember) {
      return {
        success: false,
        error: "You are already a member of this class",
      };
    }

    const { data, error } = await supabase
      .from("ClassMembers")
      .insert({
        user_id: currentSession?.user.id,
        class_id: classId,
      })
      .select();
    if (error) {
      console.log("Error joining class: ", error);
      return {
        success: false,
        error,
      };
    }

    return { success: true, data };
  };

  return (
    <TableContext.Provider
      value={{
        classes,
        getClasses,
        joinClass,
        addClass,
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
