import { format } from "date-fns";

type AssignmentCardProps = {
  className: string;
  dueDate: Date;
};

const AssignmentsCard = ({ className, dueDate }: AssignmentCardProps) => {
  const clipClassName = (nameOfClass: string) => {
    if (nameOfClass.includes(" ")) {
      return nameOfClass.split(" ")[1].charAt(0);
    }
    return nameOfClass.charAt(0);
  };

  return (
    <div className="h-[110px] rounded-xl flex items-center px-3 shadow-[0px_0px_10px_rgba(0,0,0,0.3)]">
      <div className="h-22 w-22 bg-[#707070] rounded-xl flex justify-center items-center mr-2">
        <p className="text-5xl text-white">{clipClassName(className)}</p>
      </div>
      <div>
        <p className="text-xl mb-3">{className}</p>
        <p className="text-[#7D7D7D]">
          Due{" "}
          <span className="italic">{format(dueDate, "MMM do, h:mm a")}</span>
        </p>
      </div>
    </div>
  );
};

export default AssignmentsCard;
