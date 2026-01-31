import img1 from "../assets/react.svg";

const NavBar = () => {
  return (
    <div className="flex justify-between items-center">
        <img className="h-[60px]" src={img1} />
        <div>
          <button className="mr-4 px-2 py-[6px] border-[2px] border-[#5B92FF] rounded-sm shadow-xl min-w-[100px] text-xl text-[#5B92FF] font-inter font-medium">
            Sign-Up
          </button>
          <button className="px-2 py-2 rounded-sm shadow-xl min-w-[100px] bg-[#5B92FF] text-xl text-white font-medium font-inter">
            Login
          </button>
        </div>
      </div>
  )
}

export default NavBar