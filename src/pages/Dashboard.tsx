import Class_Selected from "../assets/images/Class_Selected.svg";
import Class_Unselected from "../assets/images/Class_Unselected.svg";
import Assignment_Selected from "../assets/images/Assignment_Selected.svg";
import Assignment_Unselected from "../assets/images/Assignment_Unselected.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser } from '@fortawesome/free-solid-svg-icons'
import { useState } from "react";
import ClassesPage from "./ClassesPage";
import AssignmentsPage from "./AssignmentsPage";

function DashboardPage() {
  const [selectedPage, setSelectedPage] = useState("classes");
  const [pageSwitcher, setPageSwitcher] = useState("classes");

  return (
    <div className="flex h-screen font-inter">
      <div className="bg-[#5B92FF] min-w-26 flex flex-col items-center py-4">
        <div className="">
          <FontAwesomeIcon icon={faCircleUser} size="4x" className="text-white"/>
        </div>
        <div className="h-screen flex flex-col items-center justify-evenly">
          <div>
            <button
              onClick={() => {
                setSelectedPage("classes");
                setPageSwitcher("classes");
              }}
            >
              <img
                src={selectedPage === "classes" ? Class_Selected : Class_Unselected}
                className="h-15"
              />
              <p className="text-center text-white mt-1">Classes</p>
            </button>
          </div>
          <div className=" h-[0.1px] w-21 bg-white"></div>
          <div className="">
            <button
              className="flex flex-col items-center"
              onClick={() => {
                setSelectedPage("assignments");
                setPageSwitcher("");
              }}
            >
              <img
                src={selectedPage === "assignments" ? Assignment_Selected : Assignment_Unselected}
                className="h-15"
              />
              <p className="text-center text-white mt-1">Assignments</p>
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1">
        {pageSwitcher === "classes" ? <ClassesPage /> : <AssignmentsPage />}
      </div>
    </div>
  );
}

export default DashboardPage;
