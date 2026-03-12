import Arrow_Back from "../assets/images/Arrow_Back.webp";
import type { AssignmentType } from "../types/Types";

type AssignmentProps = {
  nameOfClass: string;
  assignmentData: AssignmentType;
  file: string;
  onClick: () => void;
};

const AssignmentContent = ({
  nameOfClass,
  assignmentData,
  file,
  onClick,
}: AssignmentProps) => {
  return (
    <div className="font-inter">
      <div className="h-20 py-3 px-6">
        <div className="mb-2 flex items-center">
          <button onClick={onClick} className="mr-3">
            <img src={Arrow_Back} className="w-[34px]" />
          </button>
          <p className="text-4xl">
            <span className="text-gray-600 opacity-50">Assignments</span> /{" "}
            {nameOfClass}
          </p>
        </div>
        <div className="h-[0.1px] bg-[#B2A9A9]"></div>

        <div className="w-100 mt-3">
          <p className="text-3xl font-bold mb-2">
            {assignmentData.assignmentName}
          </p>

          <p className="mb-12">{assignmentData.assignmentDesc}</p>

          <p className="mb-2">{file}</p>

          <button className="rounded-md py-2 px-1 text-lg text-white bg-[#5B92FF] shadow-[0px_2px_10px_rgba(0,0,0,0.4)]">
            Upload files
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentContent;
