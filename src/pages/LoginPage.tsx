import { Link } from "react-router-dom"

const LoginPage = () => {
  return (
    <div className="h-[100vh] justify-between flex font-inter">
      <div className="h-[100vh] w-[90vh] bg-[#5B92FF] rounded-r-[110px]">
        <div className="h-[100vh] flex flex-col justify-center items-center">
          <p className="text-white text-center text-7xl/22 mb-10">
            WELCOME
            <br /> BACK!
          </p>

          <p className="text-white text-xl mb-2">Don't have an account?</p>
          <Link to="/signup">
            <button className=" px-2 py-[6px] border-[2px] border-white rounded-sm shadow-xl min-w-[150px] text-xl text-white font-medium">
              Sign Up
            </button>
          </Link>
        </div>
      </div>

      <div className="h-[100vh] w-[111vh] flex flex-col items-center justify-center">
        <p className="text-5xl text-[#5B92FF] font-medium">Login</p>
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
          <button className="text-[#565656] mb-4">Forgot password?</button>
          <div className="flex justify-center">
            <button className="px-2 py-[6px] bg-[#5B92FF] rounded-sm shadow-xl min-w-[160px] text-2xl text-white font-medium">
              Login
            </button>
          </div>
        </form>

        <p className="text-center mt-2">or login with</p>
        {/* Add other sign in methods here */}
      </div>
    </div>
  )
}

export default LoginPage