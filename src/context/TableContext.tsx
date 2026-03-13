import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "../services/Supabase";
import { UserAuth } from "./AuthContext";
import type { ClassesType } from "../types/Types";

type TableResult = {
  success: boolean;
  error?: any | any[];
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
  loadLectures: (classId: string) => Promise<TableResult>;
  loadLecturesContent: (lectureId: string) => Promise<TableResult>;
  uploadAssignment: (
    assignment: File,
    assignmentName: string,
    assignemntDesc: string,
    classId: string,
    nameOfClass: string,
    dueDate: string | Date,
  ) => Promise<TableResult>;
  uploadAssignmentSolution: (
    assignmentSol: File,
    classId: string,
    nameOfClass: string,
  ) => Promise<TableResult>;
  deleteAssignmentAfterDueDate: (assignmentId: string) => Promise<TableResult>;
  loadAssignments: (classId: string) => Promise<TableResult>;
  loadAssignmentContents: (assignmentId: string) => Promise<TableResult>;
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
        lecture_id: LectureCreation?.leacture_id,
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
  const loadLectures = async (classId: string) => {
    const { data, error } = await supabase
      .from("ClassLectures")
      .select("*")
      .eq("class_id", classId);

    if (error) {
      console.error("Error while fetching lectures: ", error);
      return { success: false, error };
    }

    return { success: true, data };
  };

  //To get the content inside each lecture
  const loadLecturesContent = async (lectureId: string) => {
    const { data: lectureFileURL, error: lectureFileURLError } = await supabase
      .from("ClassLectureFiles")
      .select("lecture_file_URL")
      .eq("lecture_id", lectureId)
      .single();
    if (lectureFileURLError) {
      return { success: false, lectureFileURLError };
    }

    return { success: true, lectureFileURL };
  };

  const uploadAssignment = async (
    assignment: File,
    assignmentName: string,
    assignemntDesc: string,
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
            assignment_desc: assignemntDesc,
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

  const uploadAssignmentSolution = async (
    assignmentSol: File,
    classId: string,
    nameOfClass: string,
  ) => {
    //First: Get the assignment id that is related to the class that has the assignment
    const { data, error: assignmentIdError } = await supabase
      .from("ClassAssignment")
      .select("assignment_id")
      .eq("class_id", classId)
      .single();
    if (assignmentIdError) {
      console.error("Failed to fetch assignment id: ", assignmentIdError);
      return { success: false, assignmentIdError };
    }

    const assignmentId = data?.assignment_id;

    //Second: Upload the solution file to the path "class name_solution/user id"
    const { error: uploadedSolutionError } = await supabase.storage
      .from("ClassAssignments")
      .upload(`${nameOfClass}_solutions/${session?.user.id}`, assignmentSol);
    if (uploadedSolutionError) {
      console.error("Error uploading your solution: ", uploadedSolutionError);
      return { success: false, uploadedSolutionError };
    }

    //Third: Upload the solution file URL to the "ClassAssignmentsFiles" table
    const { data: publicURL } = await supabase.storage
      .from("ClassAssignment")
      .getPublicUrl(`${nameOfClass}_solutions/${session?.user.id}`);

    const { error } = await supabase
      .from("ClassAssignmentFiles")
      .insert([
        {
          assignment_id: assignmentId,
          assignment_file_URL: publicURL,
        },
      ])
      .select();
    if (error) {
      console.error("Error adding the files to the table: ", error);
      return { success: false, error };
    }

    return { success: true };
  };

  const deleteAssignmentAfterDueDate = async (assignmentId: string) => {
    //First delete the row from the table "ClassAssignments"
    const { data, error } = await supabase
      .from("ClassAssignments")
      .select("*")
      .eq("assignment_id", assignmentId)
      .single();

    if (error) {
      console.error("Error occured while fetching the assignment", error);
      return { success: false, error };
    }

    if (new Date(data?.due_date).getTime() === new Date().getTime()) {
      const { error: assignmentDeleteFromTableError } = await supabase
        .from("ClassAssignments")
        .delete()
        .eq("assignemnt_id", assignmentId);
      if (assignmentDeleteFromTableError) {
        console.error(
          "Error deleting assignment from table",
          assignmentDeleteFromTableError,
        );
        return { success: false, assignmentDeleteFromTableError };
      }

      const { data: fileURL, error: fileURLError } = await supabase
        .from("ClassAssignmentFiles")
        .select("assignment_file_URL")
        .eq("assignment_id", assignmentId);
      if (fileURLError) return { success: false, fileURLError };

      const filePaths = fileURL?.map((item) => {
        const file = item.assignment_file_URL;
        return file.split("/storage/v1/object/public/ClassAssignments/")[1];
      });

      const { error: deleteFileError } = await supabase.storage
        .from("ClassAssignments")
        .remove(filePaths);
      if (deleteFileError) return { success: false, deleteFileError };
    }

    return { success: true };
  };

  const loadAssignments = async (classId: string) => {
    const { data, error } = await supabase
      .from("ClassAssignments")
      .select("*")
      .eq("class_id", classId);

    if (error) {
      console.error("Error while fetching assignment list: ", error);
      return { success: false, error };
    }

    return { success: true, data };
  };

  const loadAssignmentContents = async (assignmentId: string) => {
    const { data: assignmentFileURL, error: assignmentFileURLError } =
      await supabase
        .from("ClassAssignmentFiles")
        .select("assignment_file_URL")
        .eq("assignment_id", assignmentId);
    if (assignmentFileURLError)
      return { success: false, assignmentFileURLError };

    return { success: true, assignmentFileURL };
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
        uploadAssignmentSolution,
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
