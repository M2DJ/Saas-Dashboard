import { useState } from "react";
import { Link } from "react-router-dom";

const SignUpPage = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState();
  const [error, setError] = useState();

  return (
    <div className="h-[100vh] justify-between flex font-inter overflow-hidden">
      <div className="h-[100vh] w-[111vh] flex flex-col items-center justify-center">
        <p className="text-5xl text-[#5B92FF] font-medium">Sign Up</p>
        <form className="mt-5">
          <label className="text-[25px]">Email</label>
          <br />
          <input
            type="text"
            className="bg-[#A2A2A2] rounded-lg h-11 w-120 mb-5 pl-3"
          />
          <br />
          <label className="text-[25px]">Password</label>
          <br />
          <input
            type="password"
            className="bg-[#A2A2A2] rounded-lg h-11 w-120 mb-5 pl-3"
          />
          <br />
          <label className="text-[25px]">Confirm Password</label>
          <br />
          <input
            type="password"
            className="bg-[#A2A2A2] rounded-lg h-11 w-120 mb-5 pl-3"
          />
          <br />
          <div className="flex justify-center">
            <button className="px-2 py-[6px] bg-[#5B92FF] rounded-sm shadow-xl min-w-[160px] text-2xl text-white font-medium">
              Sign Up
            </button>
          </div>
        </form>

        <p className="text-center mt-2">or sign up with</p>
        {/* Add other sign in methods here */}
      </div>

      <div className="h-[100vh] w-[90vh] bg-[#5B92FF] rounded-l-[110px]">
        <div className="h-[100vh] flex flex-col justify-center items-center">
          <p className="text-white text-7xl/22 mb-10">
            CREATE AN
            <br /> ACCOUNT!
          </p>

          <p className="text-white text-xl mb-2">Already have an account?</p>
          <Link to="/login">
            <button className="mr-4 px-2 py-[6px] border-[2px] border-white rounded-sm shadow-xl min-w-[150px] text-xl text-white font-medium">
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
