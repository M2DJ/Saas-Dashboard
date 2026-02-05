import AssignmentsCard from "../components/AssignmentsCard";

const AssignmentsPage = () => {
  const assignments = [{ className: "Python", dueDate: new Date() }];

  return (
    <div className="font-inter">
      <div className="h-20 py-3 px-6">
        <p className="text-4xl mb-2">Assignments</p>
        <div className="h-[0.1px] bg-[#B2A9A9]"></div>
      </div>

      <div className="px-6">
        {assignments.map((assignment) => (
          <AssignmentsCard className={assignment.className} dueDate={assignment.dueDate} />
        ))}
      </div>
    </div>
  );
};

export default AssignmentsPage;
