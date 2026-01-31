import NavBar from "../components/NavBar";
import img1 from "../assets/images/unsplash_oXlXu2qukGE.jpg";
import Github from "../assets/images/Github_Logo.jpg";
import Linkedin from "../assets/images/Linkedin_Logo.jpg";

function HomePage() {
  return (
    <div className="px-[160px] pt-2 font-inter">
      {/* Navigation bar */}
      <NavBar />
      
      {/* Hero section */}
      <div className="flex justify-between items-center h-[90dvh]">
        <div>
          <p className="text-5xl text-[#5B92FF] font-semibold mb-1">
            Get work done
            <br /> faster than a ever
          </p>
          <p className="text-xl text-[#616161] font-semibold">
            Get all your work in one place
          </p>
          <div className="mt-[20px]">
            <button className="min-w-[250px] min-h-[70px] bg-white rounded-xl text-[28px] text-[#5B92FF] font-semibold shadow-2xl">
              Get Started
            </button>
          </div>
        </div>

        {/* Add an image of the dashboard after finishing it here*/}
        <div></div>
      </div>

      {/* Mission section */}
      <div
        className="h-[100vh] bg-cover bg-center bg-no-repeat bg-black/50 bg-blend-darken mb-10 -mx-[160px] flex flex-col justify-center items-center"
        style={{ backgroundImage: `url(${img1})` }}
      >
        <div className="mb-6">
          <p className="text-white text-8xl font-bold">Our Mission</p>
        </div>
        <div>
          <p className="text-white text-center text-[28px]">
            Is to develop a unique,
            <br /> fast and simple application
            <br /> for your office
          </p>
        </div>
      </div>

      {/* Last part of the home page + Footer */}
      <div className="h-[100vh] w-auto">
        <div className="flex justify-center-safe">
          <p className="mt-7 text-4xl">
            So Simple, You think it's a{" "}
            <span className="text-[#5B92FF] font-extrabold">Scam</span>
          </p>
        </div>
        {/* Here is where you add a small video of the dashboard */}
        <div></div>
      </div>
      {/* Footer */}
      <footer className="h-30">
        {/* Divider */}
        <div className="bg-[#333] h-[1px]"></div>
        <div className="flex justify-center items-center pt-9">
          <a href="https://github.com/M2DJ" target="_blank" className="flex items-center mr-50">
            <img src={Github} className="h-[40px] mr-1"/>
            <p className="text-3xl font-medium">Github</p>
          </a>
            <a href="https://linkedin.com/in/saif-allah-mohamed" target="_blank" className="flex items-center">
              <img src={Linkedin} className="h-[40px] mr-1"/>
              <p className="text-3xl font-medium">LinkedIn</p>
            </a>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
