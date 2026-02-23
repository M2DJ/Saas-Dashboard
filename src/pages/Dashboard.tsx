import Class_Selected from "../assets/images/Class_Selected.svg";
import Class_Unselected from "../assets/images/Class_Unselected.svg";
import Assignment_Selected from "../assets/images/Assignment_Selected.svg";
import Assignment_Unselected from "../assets/images/Assignment_Unselected.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faCircleUser,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import ClassesPage from "./ClassesPage";
import AssignmentsPage from "./AssignmentsPage";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

function DashboardPage() {
  const [selectedPage, setSelectedPage] = useState("classes");
  const [pageSwitcher, setPageSwitcher] = useState("classes");
  const [userSelected, setUserSelected] = useState(false);
  const [loading, setLoading] = useState(false);

  const { logOut } = UserAuth();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      setLoading(true);
      const result = await logOut();

      if (result.success) {
        navigate("/");
      } else {
        console.error("Logout failed: ", result.error);
        alert("Failed to logout, Please try again.");
      }
    } catch (e) {
      console.error("Logout error:", e);
      alert("An error occurred during logout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen font-inter">
      {userSelected && (
        <div
          className="fixed inset-0 z-2"
          onClick={() => setUserSelected(false)}
        />
      )}
      <div className="bg-[#5B92FF] min-w-26 flex flex-col items-center py-4">
        <div onClick={() => setUserSelected((prev) => !prev)} className="">
          <FontAwesomeIcon
            icon={faCircleUser}
            size="4x"
            className="text-white"
          />
        </div>
        {userSelected && (
          <div className="absolute top-5 left-23 p-3 bg-white rounded-lg shadow-lg z-3">
            <button
            onClick={handleLogOut}
            disabled={loading}
            className="text-xl flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <LoadingSpinner />
              ) : (
                <>
                  Logout <FontAwesomeIcon icon={faArrowRightFromBracket} />
                </>
              )}
            </button>
          </div>
        )}
        <div className="h-screen flex flex-col items-center justify-evenly">
          <div>
            <button
              onClick={() => {
                setSelectedPage("classes");
                setPageSwitcher("classes");
              }}
            >
              <img
                src={
                  selectedPage === "classes" ? Class_Selected : Class_Unselected
                }
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
                src={
                  selectedPage === "assignments"
                    ? Assignment_Selected
                    : Assignment_Unselected
                }
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
