import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/SignUpPage.css";
import { UserAuth } from "../context/AuthContext";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setconfirmPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  //Animation state
  const [isClosed, setIsClosed] = useState(false);

  const { signUp } = UserAuth();

  const navigate = useNavigate();

  const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!email.includes("@")) {
        setEmailError("Invalid Email");
      }

      if (password.length < 6) {
        setPasswordError("Password must be atleast 6 characters long");
      }

      if (password.includes(" ")) {
        setPasswordError("Password can only have these characters: -,_,/");
      }

      if (confirmPassword != password) {
        setconfirmPasswordError("Password does not match");
      }

      const result = await signUp(email, password);
      if (result.success) {
      }
    } catch (e) {
      setError("An error occured");
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[100vh] justify-between flex font-inter overflow-hidden">
      <div
        className={`h-[100vh] w-[111vh] flex flex-col items-center justify-center ${isClosed ? "animateFormClose" : "animateFormOpen"}`}
      >
        <p className="text-5xl text-[#5B92FF] font-medium">Sign Up</p>
        <form className="mt-5" onSubmit={handleForm}>
          <label className="text-[25px]">Email</label>
          <br />
          <input
            type="text"
            className="bg-[#A2A2A2] rounded-lg h-11 w-120 mb-5 pl-3"
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          {emailError.length > 1 && (
            <p className="text-red-500">{emailError}</p>
          )}
          <label className="text-[25px]">Password</label>
          <br />
          <input
            type="password"
            className="bg-[#A2A2A2] rounded-lg h-11 w-120 mb-5 pl-3"
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          {passwordError.length > 1 && (
            <p className="text-red-500">{passwordError}</p>
          )}
          <label className="text-[25px]">Confirm Password</label>
          <br />
          <input
            type="password"
            className="bg-[#A2A2A2] rounded-lg h-11 w-120 mb-5 pl-3"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <br />
          {confirmPasswordError.length > 1 && (
            <p className="text-red-500">{confirmPasswordError}</p>
          )}
          <div className="flex justify-center">
            <button className="px-2 py-[6px] bg-[#5B92FF] rounded-sm shadow-xl min-w-[160px] text-2xl text-white font-medium flex items-center justify-center">
              {loading ? (
                <svg
                  className="animate-spin h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
        </form>

        <p className="text-center mt-2">or sign up with</p>
        {/* Add other sign in methods here */}
      </div>

      <div
        className={`h-[100vh] w-[90vh] bg-[#5B92FF] rounded-l-[110px] ${isClosed ? "animatePanelClose" : "animatePanelOpen"}`}
      >
        <div className="h-[100vh] flex flex-col justify-center items-center ">
          <p className="text-white text-7xl/22 mb-10">
            CREATE AN
            <br /> ACCOUNT!
          </p>

          <p className="text-white text-xl mb-2">Already have an account?</p>
          <button
            className="mr-4 px-2 py-[6px] border-[2px] border-white rounded-sm shadow-xl min-w-[150px] text-xl text-white font-medium"
            onClick={() => {
              setTimeout(() => navigate("/login"), 500);
              setIsClosed(true);
            }}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
