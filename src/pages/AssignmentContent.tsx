import { useRef, useState } from "react";
import Arrow_Back from "../assets/images/Arrow_Back.webp";
import type { AssignmentType } from "../types/Types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-regular-svg-icons";

type AssignmentProps = {
  assignmentData: AssignmentType;
  onClick: () => void;
};

const AssignmentContent = ({ assignmentData, onClick }: AssignmentProps) => {
  const [uploadedAssignmentFile, setUploadedAssignmentFile] = useState<
    File | undefined
  >();

  const uploadedAssignmentRef = useRef<HTMLInputElement>(null);

  const submitAssignmentSolution = async () => {};

  return (
    <div className="font-inter">
      <div className="h-20 py-3 px-6">
        <div className="mb-2 flex items-center">
          <button onClick={onClick} className="mr-3">
            <img src={Arrow_Back} className="w-[34px]" />
          </button>
          <p className="text-4xl">
            <span className="text-gray-600 opacity-50">Assignments</span> /{" "}
            {assignmentData.class_name}
          </p>
        </div>
        <div className="h-[0.1px] bg-[#B2A9A9]"></div>

        <div className="w-100 mt-3">
          <p className="text-3xl font-bold mb-2">
            {assignmentData.assignment_name}
          </p>

          <p className="mb-12">{assignmentData.assignment_desc}</p>

          <div className="mb-7">
            {uploadedAssignmentFile != undefined && (
              <div className="h-2 flex items-center">
                <FontAwesomeIcon icon={faFile} size="xl" />
                <p className="text-xl">{uploadedAssignmentFile.name}</p>
              </div>
            )}
          </div>

          <form onSubmit={submitAssignmentSolution}>
            <button
              type={uploadedAssignmentFile != undefined ? "submit" : "button"}
              onClick={() => uploadedAssignmentRef.current?.click()}
              className="rounded-md py-2 px-1 text-lg text-white bg-[#5B92FF] shadow-[0px_2px_10px_rgba(0,0,0,0.4)]"
            >
              {uploadedAssignmentFile != undefined
                ? "Submit Files"
                : "Upload Files"}
            </button>
            <br />
            <input
              type="file"
              ref={uploadedAssignmentRef}
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setUploadedAssignmentFile(file);
              }}
              className="hidden"
            />
            <br />
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignmentContent;
