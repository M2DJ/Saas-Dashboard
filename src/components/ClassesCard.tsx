import Dot_Menu from "../assets/images/Three_Dot_Menu.svg";
import Spacing_Dot from "../assets/images/Spacing_Dot.svg";

type ClassesCardProps = {
  className: string;
  numOfLectures: number;
  numOfAssignments: number;
};

const ClassesCard = ({
  className,
  numOfLectures,
  numOfAssignments,
}: ClassesCardProps) => {

  const clipClassName = (nameOfClass: string) => {
    if (nameOfClass.includes(" ")) {
      return nameOfClass.split(" ")[1].charAt(0);
    }
    return nameOfClass.charAt(0);
  };

  return (
    <div className="font-inter h-[180px] w-[370px] p-2 rounded-xl relative shadow-[0px_0px_8px_rgba(0,0,0,0.3)]">
      <div className="flex justify-between items-start">
          <div className="h-22 w-22 bg-[#707070] rounded-xl flex justify-center items-center mb-5">
            <p className="text-5xl text-white">{clipClassName(className)}</p>
          </div>
        <button className="mt-3 mr-2">
          <img src={Dot_Menu} />
        </button>
      </div>
      <p className="text-2xl">{className}</p>
      <div className="text-[#7D7D7D] flex gap-2">
        <p>{numOfLectures} Lecture(s)</p>
        <img src={Spacing_Dot} className="mt-1" />
        <p>{numOfAssignments} Assignment(s)</p>
      </div>
    </div>
  );
};

export default ClassesCard;
