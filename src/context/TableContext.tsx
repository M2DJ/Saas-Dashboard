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
  data?: any | any[];
};

type TableContextType = {
  classes: ClassesType[];
  addClass: (nameOfClass: string) => Promise<TableResult>;
  getClasses: () => Promise<TableResult>;
  joinClass: (classId: string) => Promise<TableResult>;
  uploadLecture: (
    lecture: File,
    lectureName: string,
    classId: string,
    nameOfClass: string,
  ) => Promise<TableResult>;
  loadLectures: (nameOfClass: string) => Promise<TableResult>;
  loadLecturesContent: (
    nameOfClass: string,
    lectureName: string,
  ) => Promise<TableResult>;
  uploadAssignment: (
    assignment: File,
    assignmentName: string,
    classId: string,
    nameOfClass: string,
    dueDate: string | Date,
  ) => Promise<TableResult>;
  deleteAssignmentAfterDueDate: (assignmentId: string) => Promise<TableResult>;
  loadAssignments: (nameOfClass: string) => Promise<TableResult>;
  loadAssignmentContents: (
    nameOfClass: string,
    assignmentName: string,
  ) => Promise<TableResult>;
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

  const uploadLecture = async (
    lecture: File,
    lectureName: string,
    classId: string,
    nameOfClass: string,
  ) => {
    //First: add the lecture name to the "ClassLectures" table
    const { data: LectureCreation, error: lectureCreationError } =
      await supabase
        .from("ClassLectures")
        .insert([{ class_id: classId, lecture_name: lectureName }])
        .select()
        .single();
    if (lectureCreationError) {
      console.error("Error creating lecture: ", lectureCreationError);
      return { success: false, lectureCreationError };
    }

    //Second: Upload the lecture file
    const { data: existingFiles, error: listError } = await supabase.storage
      .from("ClassLectures")
      .list(nameOfClass);

    if (listError) {
      console.error("Error listing files: ", listError);
      return { success: false, error: listError };
    }

    const fileCount = existingFiles.length || 0;

    const { error: uploadedFileError } = await supabase.storage
      .from("ClassLectures")
      .upload(`${nameOfClass}/Lecture_${fileCount + 1}`, lecture);

    if (uploadedFileError) {
      console.error("Failed to upload lecture: ", uploadedFileError);
      return { success: false, uploadedFileError };
    }

    //Third: store the file URL in the "ClassLectureFiles" for future use

    //To get the file URL
    const { data: uploadedFileURL } = supabase.storage
      .from("ClassLectures")
      .getPublicUrl(`${nameOfClass}/Lecture_${fileCount}`);
    //Inserting the row with the URL
    const { error } = await supabase.from("ClassLectureFiles").insert([
      {
        lecture_id: LectureCreation?.lecture_id,
        lecture_file_URL: uploadedFileURL,
      },
    ]);

    if (error) {
      console.error("Error inserting row: ", error);
      return { success: false, error };
    }

    return { success: true };
  };

  //Get all the files with the given class name
  const loadLectures = async (nameOfClass: string) => {
    const { data, error } = await supabase.storage
      .from(nameOfClass)
      .list(nameOfClass, {
        sortBy: {
          column: "name",
          order: "asc",
        },
      });

    if (error) {
      console.error("Error while fetching lectures: ", error);
      return { success: false, error };
    }

    return { success: true, data };
  };

  //To get the content inside each lecture
  const loadLecturesContent = async (
    nameOfClass: string,
    lecturesName: string,
  ) => {
    const { data, error } = await supabase.storage
      .from(nameOfClass)
      .list(lecturesName, {
        sortBy: {
          column: "name",
          order: "asc",
        },
      });

    if (error) {
      console.error("Error while fetching leacture files: ", error);
      return { success: false, error };
    }

    return { success: true, data };
  };

  const uploadAssignment = async (
    assignment: File,
    assignmentName: string,
    classId: string,
    nameOfClass: string,
    dueDate: string | Date,
  ) => {
    //First: Add a row with the assignment details to the "ClassAssignments" table
    const { data: addedAssignment, error: addedAssignmentError } =
      await supabase
        .from("ClassAssignments")
        .insert([
          {
            assignment_name: assignmentName,
            class_id: classId,
            due_date: dueDate,
          },
        ])
        .select()
        .single();
    if (addedAssignmentError) {
      console.error(
        "An error as occured while adding your assingmnet: ",
        addedAssignmentError,
      );
      return { success: false, addedAssignmentError };
    }

    //Second: Upload the file to the storage bucket called "ClassAssignments"
    const { data: numOfFiles, error: listFilesError } = await supabase.storage
      .from("ClassAssignments")
      .list(nameOfClass);
    if (listFilesError) {
      console.error("Error listing files: ", listFilesError);
      return { success: false, listFilesError };
    }

    const fileCount = numOfFiles.length || 0;

    const { error: uploadedAssignmentFileError } = await supabase.storage
      .from("ClassAssignments")
      .upload(`${nameOfClass}/$Assignment_${fileCount + 1}`, assignment);

    if (uploadedAssignmentFileError) {
      console.error(
        "Error uploading assignment file: ",
        uploadedAssignmentFileError,
      );
      return { success: false, uploadedAssignmentFileError };
    }

    //Third: Add the file URL to the "ClassAssignmentFiles" table
    const { data: assignmentFileURL } = await supabase.storage
      .from("ClassAssignment")
      .getPublicUrl(`${nameOfClass}/Assignment_${fileCount + 1}`);

    const { error } = await supabase
      .from("ClassAssignmentFiles")
      .insert([
        {
          assignment_id: addedAssignment?.assignment_id,
          assignment_file_URL: assignmentFileURL,
        },
      ])
      .single();
    if (error) {
      console.error("An error has occured while adding you files: ", error);
      return { success: false, error };
    }

    return { success: true };
  };

  const deleteAssignmentAfterDueDate = async (assignmentId: string) => {};

  const loadAssignments = async (nameOfClass: string) => {
    const { data, error } = await supabase.storage
      .from("ClassAssignments")
      .list(nameOfClass, {
        sortBy: {
          column: "name",
          order: "asc",
        },
      });

    if (error) {
      console.error("Error while fetching assignment list: ", error);
      return { success: false, error };
    }

    return { success: true, data };
  };

  const loadAssignmentContents = async (
    nameOfClass: string,
    assignmentName: string,
  ) => {
    const { data, error } = await supabase.storage
      .from(nameOfClass)
      .list(assignmentName, {
        sortBy: {
          column: "name",
          order: "asc",
        },
      });

    if (error) {
      console.error("Error while fetching assignment list: ", error);
      return { success: false, error };
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
        uploadLecture,
        loadLectures,
        loadLecturesContent,
        uploadAssignment,
        deleteAssignmentAfterDueDate,
        loadAssignments,
        loadAssignmentContents,
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
