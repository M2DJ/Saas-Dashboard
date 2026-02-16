import React, { useEffect, useState } from "react";
import ClassesCard from "../components/ClassesCard";
import Arrow_Back from "../assets/images/Arrow_Back.webp";
import ClassContent from "./ClassContent";
import { tableInserterAndRemover } from "../context/TableContext";

export type ClassesType = {
  class_id: string;
  class_name: string;
  class_creator: string;
  created_at: string;
};

const ClassesPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [createAClass, setCreateAClass] = useState("");
  const [selectedClass, setSelectedClass] = useState(false);
  const [createClassName, setCreateClassName] = useState("");

  //State for classes

  const [classError, setClassError] = useState("");
  const [classLoading, setClassLoading] = useState("");

  const { classes, addClass, getClasses } = tableInserterAndRemover();

  useEffect(() => {
    const getThoseClasses = async () => {
      try {
        const result = await getClasses();

        if (result.success == false) {
          console.log(
            "An error has occured while fetching classes: ",
            result.error,
          );
          setClassError(result.error.message);
        }
      } catch (e) {
        console.log("An error has occured: ", e);
      }
    };

    getThoseClasses();
  }, []);

  const submitCreateClass = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      const result = await addClass(createClassName);

      if (result.success) {
        handleCloseAnimationPopUp();
        setCreateClassName("");
      } else {
        console.log("Failed to create class: ", result.error);
      }
    } catch (e) {
      console.log("There was an error creating the class: ", e);
    }
  };

  const handleCloseAnimationPopUp = () => {
    setIsClosing(true);
    setTimeout(() => {
      setOpenDialog(false);
      setIsClosing(false);
      setCreateAClass("");
    }, 300);
  };

  const handleOpenAnimationPopUp = () => {
    setOpenDialog(true);
    setIsOpening(true);

    setTimeout(() => setIsOpening(false), 50);
  };

  const lectures = [
    {
      fileName: "First Lecture",
      uploadDate: new Date(),
      fileSize: 2.4,
    },
    {
      fileName: "Second Lecture",
      uploadDate: new Date(),
      fileSize: 2.4,
    },
    {
      fileName: "Third Lecture",
      uploadDate: new Date(),
      fileSize: 2.4,
    },
  ];
  return (
    <>
      {openDialog && (
        <>
          <div
            onClick={handleCloseAnimationPopUp}
            className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${
              isOpening || isClosing ? "opacity-0" : "opacity-50"
            }`}
          ></div>

          <div
            className={`w-110 h-60 rounded-lg bg-white shadow-[0px_0px_8px_rgba(0,0,0,0.3)] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-300 ${
              isOpening || isClosing
                ? "opacity-0 scale-95"
                : "opacity-100 scale-100"
            }`}
          >
            {createAClass === "" ? (
              <>
                <div className="h-60 flex flex-col justify-center items-center">
                  <button
                    onClick={() => setCreateAClass("join")}
                    className="w-90 h-13 text-3xl text-white rounded-md bg-[#5B92FF] mb-2"
                  >
                    Join a Class
                  </button>
                  <p className="text-xl mb-2">OR</p>
                  <button
                    onClick={() => setCreateAClass("create")}
                    className="w-90 h-13 text-3xl text-white rounded-md bg-[#5B92FF]"
                  >
                    Create a Class
                  </button>
                </div>
              </>
            ) : createAClass === "create" ? (
              <>
                <div className="p-4">
                  <button onClick={() => setCreateAClass("")}>
                    <img src={Arrow_Back} className="w-7" />
                  </button>

                  <form onSubmit={submitCreateClass}>
                    <div className="h-40 flex flex-col justify-center items-center">
                      <div className="w-20 h-28 bg-[#BEBEBE] rounded-lg text-5xl flex justify-center items-center mb-2">
                        #
                      </div>
                      <p className="font-bold text-lg mb-2">
                        Add class name here
                      </p>
                      <input
                        type="text"
                        className="bg-[#BEBEBE] rounded-md p-2 text-md mb-3"
                        onChange={(e) => setCreateClassName(e.target.value)}
                      />
                      <button className="px-4 py-1 rounded-md bg-[#5B92FF] text-xl text-white">
                        Create
                      </button>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <>
                <div className="p-4">
                  <button onClick={() => setCreateAClass("")}>
                    <img src={Arrow_Back} className="w-7" />
                  </button>

                  <div className="h-40 flex flex-col justify-center items-center">
                    <div className="w-20 h-28 bg-[#BEBEBE] rounded-lg text-5xl flex justify-center items-center mb-2">
                      #
                    </div>
                    <p className="font-bold text-lg mb-2">
                      Insert class code here
                    </p>
                    <input
                      type="text"
                      className="bg-[#BEBEBE] rounded-md p-2 text-md"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {selectedClass ? (
        <ClassContent
          onClick={() => setSelectedClass(false)}
          nameOfClass={classes[0].class_name}
          lectures={lectures}
        />
      ) : (
        <div className="font-inter">
          <div className="min-h-20 py-3 px-6">
            <div className="w-full flex justify-between items-center mb-2">
              <p className="text-4xl ">Classes</p>
              <button
                onClick={handleOpenAnimationPopUp}
                className="px-2 py-1 bg-[#5B92FF] text-white text-lg rounded shadow-lg"
              >
                Join or Create a Class
              </button>
            </div>
            <div className="h-[0.1px] bg-[#B2A9A9]"></div>
          </div>

          <div onClick={() => setSelectedClass(true)} className="px-6">
            {classes.map((classItem) => (
              <ClassesCard
                key={classItem.class_id}
                className={classItem.class_name}
                // numOfLectures={classItem.numOfLectures}
                // numOfAssignments={classItem.numOfAssignments}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ClassesPage;
