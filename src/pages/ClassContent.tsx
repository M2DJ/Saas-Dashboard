import Arrow_Back from "../assets/images/Arrow_Back.webp";
import Book_Logo from "../assets/images/Book_Logo.svg";
import Search_Icon from "../assets/images/Search_Icon.svg";
import type { ClassesType } from "./ClassesPage";

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

const ClassContent = ({
  onClick,
  classData,
  lectures,
}: ClassContentProps) => {
  return (
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

      <div className="px-6 mb-2">
        <div className="h-60 bg-[#EAF1FF] rounded-xl flex flex-col justify-center items-center">
          <img src={Book_Logo} className="mb-2" />
          <p className="text-3xl mb-2">Add Files, Videos or Assignments</p>
          <button className="rounded-lg text-white text-xl bg-[#5B92FF] p-2 shadow-[0px_2px_10px_rgba(0,0,0,0.4)]">
            Upload File
          </button>
        </div>
      </div>

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
  );
};

export default ClassContent;
