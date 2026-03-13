import { useRef, useState } from "react";
import Arrow_Back from "../assets/images/Arrow_Back.webp";
import Book_Logo from "../assets/images/Book_Logo.svg";
import Search_Icon from "../assets/images/Search_Icon.svg";
import { UserAuth } from "../context/AuthContext";
import type { ClassesType } from "../types/Types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-regular-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { tableInserterAndRemover } from "../context/TableContext";

type LecturesList = {
  fileName: string;
  uploadDate: Date;
  fileSize: number;
};

type ClassContentProps = {
  onClick: () => void;
  classData: ClassesType;
  lectures: LecturesList[];
};

const ClassContent = ({ onClick, classData, lectures }: ClassContentProps) => {
  //Opening and closing pop up state
  const [openPopUp, setOpenPopUp] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  //Adding a lecture or assignment state
  const [addFiles, setAddFiles] = useState("");
  const [lectureFileUploaded, setLectureFileUploaded] = useState<File | null>(
    null,
  );
  const [lectureName, setLectureName] = useState("");
  const [assignmentFileUploaded, setAssignmentFileUploaded] =
    useState<File | null>(null);
  const [assignmentName, setAssignmentName] = useState("");
  const [assignmentDesc, setAssignmentDesc] = useState(``);
  const [assignmentDueDate, setAssginmentDueDate] = useState<Date | string>("");

  //State for loading
  const [isLoadingUploadedFiles, setIsLoadingUploadedFiles] = useState(false);
  const [isLoadingLectures, setIsLoadingLectures] = useState(false);

  const lectureFileInputRef = useRef<HTMLInputElement>(null);
  const assignmentFileInputRef = useRef<HTMLInputElement>(null);

  const { session: currentSession } = UserAuth();
  const { uploadLecture, uploadAssignment } = tableInserterAndRemover();

  const submitLecture = async () => {
    try {
      setIsLoadingUploadedFiles(true);

      const result = await uploadLecture(
        lectureFileUploaded!,
        lectureName,
        classData.class_id,
        classData.class_name,
      );
      if (!result.success) {
        console.error(result.error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingUploadedFiles(false);
    }
  };

  const submitAssignment = async () => {
    try {
      setIsLoadingUploadedFiles(true);

      const result = await uploadAssignment(
        assignmentFileUploaded!,
        assignmentName,
        assignmentDesc,
        classData.class_id,
        classData.class_name,
        assignmentDueDate,
      );

      if (!result.success) {
        console.error(result.error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingUploadedFiles(false);
    }
  };

  return (
    <>
      {openPopUp && (
        <>
          <div
            onClick={() => setOpenPopUp(false)}
            className="fixed inset-0 bg-black opacity-50 z-3"
          ></div>
          {addFiles === "" ? (
            <div className="bg-white w-150 h-90 p-4 shadow-[0px_0px_12px_rgba(0,0,0,0.6)] rounded-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-4">
              <div className="h-80 flex flex-col justify-center items-center">
                <button
                  onClick={() => setAddFiles("lecture")}
                  className="p-2 text-2xl text-white font-semibold w-100 bg-[#5B92FF] rounded-lg mb-2"
                >
                  Add lecture
                </button>
                <p className="text-xl mb-2">OR</p>
                <button
                  onClick={() => setAddFiles("assignment")}
                  className="p-2 text-2xl text-white font-semibold w-100 bg-[#5B92FF] rounded-lg"
                >
                  Add Assignment
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white w-150 h-90 p-4 shadow-[0px_0px_12px_rgba(0,0,0,0.6)] rounded-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-4 overflow-y-hidden">
              {addFiles === "lecture" ? (
                <div className="">
                  <button onClick={() => setAddFiles("")}>
                    <FontAwesomeIcon icon={faArrowLeft} size="xl" />
                  </button>
                  <div className="flex justify-center">
                    <form onSubmit={submitLecture}>
                      <label className="text-lg">Lecture Name</label>
                      <br />
                      <input
                        type="text"
                        className="w-100 h-8 pl-2 bg-[#A2A2A2] rounded-md mb-3"
                        value={lectureName}
                        onChange={(e) => setLectureName(e.target.value)}
                      />
                      <br />
                      <button
                        type="button"
                        onClick={() => lectureFileInputRef.current?.click()}
                        className="p-2 text-2xl text-white font-semibold bg-[#5B92FF] rounded-lg"
                      >
                        Upload Lecture File
                      </button>
                      <br />
                      <input
                        type="file"
                        ref={lectureFileInputRef}
                        accept=".pdf,.doc,.docx,.ppt,.pptx"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setLectureFileUploaded(file);
                        }}
                        className="hidden"
                      />
                      <br />

                      {lectureFileUploaded && (
                        <div className="h-2 flex items-center">
                          <FontAwesomeIcon icon={faFile} size="xl" />
                          <p className="text-xl">{lectureFileUploaded.name}</p>
                        </div>
                      )}

                      <div className="h-40 flex justify-center items-center">
                        <button
                          type="submit"
                          className="p-2 text-2xl text-white font-semibold bg-[#5B92FF] rounded-lg"
                        >
                          Submit lecture
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : (
                <div>
                  <button onClick={() => setAddFiles("")}>
                    <FontAwesomeIcon icon={faArrowLeft} size="xl" />
                  </button>

                  <div className="h-80 flex justify-center overflow-y-auto">
                    <form onSubmit={submitAssignment}>
                      <label>Assignment Name</label>
                      <br />
                      <input
                        type="text"
                        className="w-100 h-8 pl-2 bg-[#A2A2A2] rounded-md mb-3"
                        value={assignmentName}
                        onChange={(e) => setAssignmentName(e.target.value)}
                      />
                      <br />
                      <label>Assignment Description</label>
                      <br />
                      <textarea
                        className="min-w-100 min-h-20 p-2 bg-[#A2A2A2] rounded-md mb-3"
                        value={assignmentDesc}
                        onChange={(e) => setAssignmentDesc(e.target.value)}
                      />
                      <br />
                      <label>Due Date</label>
                      <br />
                      <input
                        type="datetime-local"
                        min={new Date().toISOString().slice(0, 16)}
                        onChange={(e) => setAssginmentDueDate(e.target.value)}
                      />
                      <br />
                      <button
                        type="button"
                        onClick={() => assignmentFileInputRef.current?.click()}
                        className="p-2 text-2xl text-white font-semibold bg-[#5B92FF] rounded-lg my-5"
                      >
                        Upload Lecture File
                      </button>
                      <br />
                      <input
                        type="file"
                        ref={assignmentFileInputRef}
                        accept=".pdf,.doc,.docx,.ppt,.pptx"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setAssignmentFileUploaded(file);
                        }}
                        className="hidden"
                      />
                      {assignmentFileUploaded && (
                        <div className="h-2 flex items-center">
                          <FontAwesomeIcon icon={faFile} size="xl" />
                          <p className="text-xl">
                            {assignmentFileUploaded.name}
                          </p>
                        </div>
                      )}
                      <div className="h-25 flex justify-center items-center">
                        <button
                          type="submit"
                          className="p-2 text-2xl text-white font-semibold bg-[#5B92FF] rounded-lg"
                        >
                          Submit Assignment
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      <div className="font-inter">
        <div className="h-20 py-3 px-6">
          <div className="mb-2 flex items-center">
            <button onClick={onClick} className="mr-3">
              <img src={Arrow_Back} className="w-[34px]" />
            </button>
            <p className="text-4xl">
              <span className="text-gray-600 opacity-50">Classes</span> /{" "}
              {classData.class_name}
            </p>
          </div>
          <div className="h-[0.1px] bg-[#B2A9A9]"></div>
        </div>

        {classData.class_creator === currentSession?.user.id ? (
          <div className="px-6 mb-2">
            <div className="h-60 bg-[#EAF1FF] rounded-xl flex flex-col justify-center items-center">
              <img src={Book_Logo} className="mb-2" />
              <p className="text-3xl mb-2">Add Files, Videos or Assignments</p>
              <button
                onClick={() => setOpenPopUp(true)}
                className="rounded-lg text-white text-xl bg-[#5B92FF] p-2 shadow-[0px_2px_10px_rgba(0,0,0,0.4)]"
              >
                Upload File
              </button>
            </div>
          </div>
        ) : (
          <div className="px-6 mb-2">
            <div className="h-60 bg-[#EAF1FF] rounded-xl flex flex-col justify-center items-center">
              <img src={Book_Logo} className="mb-2" />
              <p className="text-3xl mb-2">Latest Files</p>
            </div>
          </div>
        )}

        <div className="px-6">
          <div className="flex justify-between items-center mb-2">
            <div className="flex">
              <p className="text-[26px] mr-2">All Files</p>
              <select className="text-[26px] border-[#B2A9A9] border-2 rounded-lg focus:outline-none">
                <option>File Type</option>
              </select>
            </div>

            <div className="relative">
              <input
                type="text"
                className="h-[34px] border-[#B2A9A9] border-2 rounded-lg py-1 pl-8 focus:outline-none"
                placeholder="Search for a Leacture"
              />
              <img src={Search_Icon} className="w-6 absolute top-1 left-1" />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-lg">File Name</p>

            <div className="flex mr-15 text-lg">
              <p className="mr-11">Upload Date</p>
              <p className="">Size</p>
            </div>
          </div>
          <div className="h-[0.1px] bg-black mb-3"></div>

          <div className="overflow-y-auto h-54">
            {lectures.map((lecture, index) => (
              <div key={index}>
                <div className="flex justify-between items-center">
                  <p>{lecture.fileName}</p>

                  <div className="flex items-center mr-15">
                    <p className="mr-11">
                      {lecture.uploadDate.toString().substring(0, 15)}
                    </p>
                    <p>{lecture.fileSize}</p>
                  </div>
                </div>
                {index !== lectures.length - 1 && (
                  <div className="h-[0.1px] bg-[#B2A9A9] my-3"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ClassContent;
