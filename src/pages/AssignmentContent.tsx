import { useEffect, useRef, useState } from "react";
import Arrow_Back from "../assets/images/Arrow_Back.webp";
import type { AssignmentType } from "../types/Types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-regular-svg-icons";
import { tableInserterAndRemover } from "../context/TableContext";

type AssignmentProps = {
  assignmentData: AssignmentType;
  onClick: () => void;
};

const AssignmentContent = ({ assignmentData, onClick }: AssignmentProps) => {
  const [assingmentFile, setAssignmentFile] = useState<string | undefined>();
  const [uploadedAssignmentFile, setUploadedAssignmentFile] = useState<
    File | undefined
  >();

  const { uploadAssignmentSolution, loadAssignmentContents } =
    tableInserterAndRemover();

  const uploadedAssignmentRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadFile = async() => {
      const results = await loadAssignmentContents(assignmentData.assignment_id);
      if(results.success){
        setAssignmentFile(results.data);
      } else {
        console.error(results.error);
      }
    }

    loadFile();
  }, []);

  const submitAssignmentSolution = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const results = await uploadAssignmentSolution(
        uploadedAssignmentFile!,
        assignmentData.class_id,
        assignmentData.class_name,
      );

      if (!results.success) {
        console.error(results.error);
      }
    } catch (e) {
      console.error(e);
    }
  };

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

          {assingmentFile && (
            <div className="mb-7 p-4 bg-[#EAF1FF] rounded-lg">
            <p className="text-lg font-semibold mb-2">Assignment File:</p>
            <a
              href={assingmentFile}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5B92FF] underline flex items-center"
            >
              <FontAwesomeIcon icon={faFile} className="mr-2" />
              View Assignment File
            </a>
          </div>
          )}

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
              type={uploadedAssignmentFile == undefined ? "button" : "submit"}
              onClick={
                uploadedAssignmentFile == undefined
                  ? () => uploadedAssignmentRef.current?.click()
                  : undefined
              }
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
