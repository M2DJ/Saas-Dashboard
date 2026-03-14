import { useEffect, useState } from "react";
import AssignmentsCard from "../components/AssignmentsCard";
import AssignmentContent from "./AssignmentContent";
import type { AssignmentType } from "../types/Types";
import { tableInserterAndRemover } from "../context/TableContext";
import LoadingSpinner from "../components/LoadingSpinner";

const AssignmentsPage = () => {
  const [togleAssignmentContent, setTogleAssignmentContent] = useState(false);

  //Loading assignments state
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [assignments, setAssignments] = useState<AssignmentType[]>([]);
  const [isLoadingAssignments, setIsLoadingAssignments] = useState(false);

  const { loadAssignments } = tableInserterAndRemover();

  useEffect(() => {
    const getThoseAssignments = async () => {
      try {
        setIsLoadingAssignments(true);
        const results = await loadAssignments();

        if (!results.success) console.error(results.error);

        setAssignments(results.data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoadingAssignments(false);
      }
    };

    getThoseAssignments();
  }, []);

  const assignmentContent = assignments.find(
    (a) => a.assignment_id === selectedAssignment,
  );

  return (
    <>
      {togleAssignmentContent ? (
        <AssignmentContent
          key={assignmentContent?.assignment_id}
          assignmentData={assignmentContent!}
          onClick={() => setTogleAssignmentContent(false)}
        />
      ) : (
        <>
          {isLoadingAssignments ? (
            <div className="h-screen flex justify-center items-center">
              <LoadingSpinner size="lg"/>
            </div>
          ) : (
            <div className="font-inter">
              <div className="h-20 py-3 px-6">
                <p className="text-4xl mb-2">Assignments</p>
                <div className="h-[0.1px] bg-[#B2A9A9]"></div>
              </div>

              <div
                onClick={() => setTogleAssignmentContent(true)}
                className="px-6"
              >
                {assignments.map((assignment) => (
                  <div
                    onClick={() =>
                      setSelectedAssignment(assignment.assignment_id)
                    }
                  >
                    <AssignmentsCard
                      className={assignment.class_name}
                      dueDate={assignment.due_date}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default AssignmentsPage;
