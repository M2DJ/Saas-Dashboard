import Class_Selected from "../assets/images/Class_Selected.svg";
import Class_Unselected from "../assets/images/Class_Unselected.svg";
import Assignment_Selected from "../assets/images/Assignment_Selected.svg";
import Assignment_Unselected from "../assets/images/Assignment_Unselected.svg";
import { useState } from "react";
import ClassesPage from "./ClassesPage";
import AssignmentsPage from "./AssignmentsPage";

function DashboardPage() {
  const [selectedPage, setSelectedPage] = useState("classes");
  const [pageSwitcher, setPageSwitcher] = useState("classes");

  return (
    <div className="flex h-screen font-inter">
      <div className="bg-[#5B92FF] min-w-26 flex flex-col items-center py-4">
        <div className="h-15">
          <svg
            className="fill-current text-white"
            width="65px"
            height="65px"
            viewBox="-11.5 -10.23174 23 20.46348"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="0" cy="0" r="2.05" />
            <g stroke="currentColor" strokeWidth="1" fill="none">
              <ellipse rx="11" ry="4.2" />
              <ellipse rx="11" ry="4.2" transform="rotate(60)" />
              <ellipse rx="11" ry="4.2" transform="rotate(120)" />
            </g>
          </svg>
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
