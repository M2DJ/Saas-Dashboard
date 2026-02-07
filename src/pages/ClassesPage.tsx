import ClassesCard from "../components/ClassesCard";

const ClassesPage = () => {
  const classes = [
    {
      className: "Python",
      numOfFiles: 12,
      numOfAssignments: 1,
    },
  ];

  return (
    <div className="font-inter">
      <div className="h-20 py-3 px-6">
        <div className="w-full flex justify-between items-center mb-2">
          <p className="text-4xl ">Classes</p>
          <button className="px-2 py-1 bg-[#5B92FF] text-white text-lg rounded shadow-lg">
            Join or Create a Class
          </button>
        </div>
        <div className="h-[0.1px] bg-[#B2A9A9]"></div>
      </div>

      <div className="px-6">
        {classes.map((classItem) => (
          <ClassesCard
            className={classItem.className}
            numOfFiles={classItem.numOfFiles}
            numOfAssignments={classItem.numOfAssignments}
          />
        ))}
      </div>
    </div>
  );
};

export default ClassesPage;
