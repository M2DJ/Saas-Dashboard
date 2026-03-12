export type ClassesType = {
  class_id: string;
  class_name: string;
  class_creator: string;
  created_at: string;
  numOfLectures?: number;
  numOfAssignments?: number;
};

export type AssignmentType = {
  assignmentName: string;
  assignmentDesc: string;
  dueDate: string | Date;
}