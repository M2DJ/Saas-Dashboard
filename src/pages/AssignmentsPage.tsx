import { useState } from "react";
import AssignmentsCard from "../components/AssignmentsCard";
import AssignmentContent from "./AssignmentContent";
import type { AssignmentType } from "../types/Types";

const AssignmentsPage = () => {
  const [selectedAssignment, setSelectedAssignment] = useState(false);
  const [assignments, setAssignments] = useState<AssignmentType[]>([]);
  

  return (
    <>
      {selectedAssignment ? (
        <AssignmentContent
          nameOfClass={"Python"}
          desc={`Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim,
            labore ab cupiditate sit mollitia culpa et, in illum voluptates
            voluptatum molestiae accusantium nostrum! Consectetur vero incidunt
            ratione autem vitae facere impedit, fugiat esse cumque! Delectus
            aperiam quis autem minima voluptate, blanditiis tempora expedita
            excepturi dolores maiores. Repellat quos ipsam beatae.`}
          file={"File URL Here"}
          onClick={() => setSelectedAssignment(false)} 
          assignmentTitle={"First Assignment"}        />
      ) : (
        <div className="font-inter">
          <div className="h-20 py-3 px-6">
            <p className="text-4xl mb-2">Assignments</p>
            <div className="h-[0.1px] bg-[#B2A9A9]"></div>
          </div>

          <div onClick={() => setSelectedAssignment(true)} className="px-6">
            {assignments.map((assignment) => (
              <AssignmentsCard
                className={assignment.className}
                dueDate={assignment.dueDate}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default AssignmentsPage;
