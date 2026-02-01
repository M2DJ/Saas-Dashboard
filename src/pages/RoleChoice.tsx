import Org_Leader from "../assets/images/Org_Leader.jpg";
import Leacturer from "../assets/images/Leacturer.jpg";
import Student from "../assets/images/Student.jpg";

const RoleChoicePage = () => {
  return (
    <div className="font-inter h-screen flex flex-col">
      <div className="h-33 w-full bg-[#5B92FF] flex flex-col justify-center items-center rounded-b-[90px]">
        <p className="text-white text-5xl mb-3">Who are you?</p>
        <p className="text-white text-xl">Choose your role</p>
      </div>

      <div className="flex flex-1 flex-col justify-center items-center -mt-24">
        <div className="w-250 flex justify-around">
          <div className="flex flex-col justify-center items-center">
              <div
                className="h-60 w-60 rounded-full bg-[#333] flex justify-center items-center"
                style={{
                  backgroundImage: `url(${Org_Leader})`,
                  backgroundRepeat: "no-repeat",
                }}
              ></div>
              <p className="mt-3 text-xl">Oragization Leader</p>
          </div>
          
          <div className="flex flex-col justify-center items-center">
              <div
                className="h-60 w-60 rounded-full bg-[#333] flex justify-center items-center"
                style={{
                  backgroundImage: `url(${Leacturer})`,
                  backgroundRepeat: "no-repeat",
                }}
              ></div>
              <p className="mt-3 text-xl">Leacturer</p>
          </div>

          <div className="flex flex-col justify-center items-center">
              <div
                className="h-60 w-60 rounded-full bg-[#333] flex justify-center items-center"
                style={{
                  backgroundImage: `url(${Student})`,
                  backgroundRepeat: "no-repeat",
                }}
              >
              </div>
              <p className="mt-3 text-xl">Student</p>
          </div>
        </div>
      </div>
        <p className="absolute top-135 left-1/2 -translate-x-1/2 text-red-500 text-2xl">Note: you can not change your role after choosing</p>
    </div>
  );
};

export default RoleChoicePage;
