import Class_Selected from "../assets/images/Class_Selected.svg";
import Class_Unselected from "../assets/images/Class_Unselected.svg";
import Assignment_Selected from "../assets/images/Assignment_Selected.svg";
import Assignment_Unselected from "../assets/images/Assignment_Unselected.svg";
import { use, useState } from "react";

function DashboardPage() {
  const [selected, setSelected] = useState(true);
  const [unSelected, setUnSelected] = useState(false);

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
                setSelected((prev) => !prev);
                setUnSelected((prev) => !prev);
              }}
            >
              <img
                src={selected ? Class_Selected : Class_Unselected}
                className="h-15"
              />
              <p className="text-center text-white mt-1">Classes</p>
            </button>
          </div>
          <div className=" h-[0.5px] w-25 bg-white"></div>
          <div className="">
            <button
              className="flex flex-col items-center"
              onClick={() => {
                setSelected((prev) => !prev);
                setUnSelected((prev) => !prev);
              }}
            >
              <img
                src={unSelected ? Assignment_Selected : Assignment_Unselected}
                className="h-15"
              />
              <p className="text-center text-white mt-1">Assignments</p>
            </button>
          </div>
        </div>
      </div>
      <div className="grow-1"></div>
    </div>
  );
}

export default DashboardPage;
