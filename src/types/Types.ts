export type ClassesType = {
  class_id: string;
  class_name: string;
  class_creator: string;
  created_at: string;
  numOfLectures?: number;
  numOfAssignments?: number;
};

export type AssignmentType = {
  assignment_id: string;
  assignment_name: string;
  assignment_desc: string;
  due_date: string | Date;
  class_id: string;
  class_name: string;
}