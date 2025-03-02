import React from "react";
import Image from "next/image";
import { MuseoModerno } from "next/font/google";
import { AgentCardProps } from "@/lib/interface";
import { Skeleton } from "./ui/skeleton";
import { IoClose } from "react-icons/io5";

const museo = MuseoModerno({
  subsets: ["latin"],
  weight: ["400"],
});

const AgentCard: React.FC<AgentCardProps> = ({
  name,
  description,
  image,
  traits,
  fromGame,
  onDragStart,
  onClicked,
  status,
}) => {
  const [borderColor, setBorderColor] = React.useState<string>("#06BA99");

  if (
    name === undefined ||
    description === undefined ||
    image === undefined ||
    traits === undefined
  )
    return (
      <div
        className={`w-full  flex flex-col justify-between border p-5 bg-[#FCF5E8] ${
          fromGame ? " rounded-tr-lg" : ""
        }`}
      >
        {fromGame && (
          <p className="text-black text-2xl mb-4">No Agents Selected</p>
        )}
        <div className="flex justify-center w-full">
          <Skeleton className="h-[50px] w-[50px]  rounded-lg" />
        </div>
        <Skeleton className="h-5 w-[40%] mt-4" />

        <div className="space-y-2 mt-4">
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-2 w-[90%]" />
        </div>

        <div className="mt-3 flex  gap-2 pr-1">
          <Skeleton className="h-4 flex-1 rounded-xl" />
          <Skeleton className="h-4 flex-1 rounded-xl" />
          <Skeleton className="h-4 flex-1 rounded-xl" />
        </div>
      </div>
    );

  return (
    <div
      onMouseEnter={() => {
        setBorderColor("#F50276");
      }}
      onMouseLeave={() => {
        setBorderColor("#06BA99");
      }}
      className={`flex flex-col flex-shrink-0 ${
        fromGame
          ? "relative w-full bg-[#FCF5E8] text-[#F50276] rounded-tr-lg "
          : "w-[250px] bg-[#131313] border border-[#F50276] hover:bg-[#FCF5E8] hover:text-[#F50276] rounded-lg"
      } h-full justify-between items-start transition-all duration-300 p-5    `}
      draggable={true}
      onDragStart={(e) =>
        onDragStart && onDragStart(e, { name, description, image })
      }
    >
      {fromGame && (
        <IoClose
          className="absolute top-3 p-1 right-3 hover:bg-[#ffeac3] rounded-full text-[#000] hover:text-[#000] cursor-pointer"
          size={25}
          onClick={onClicked}
        />
      )}

      {status != undefined ? (
        status === "active" ? (
          <p className="text-black text-xl ">Active Agent</p>
        ) : (
          <p className="text-black text-xl ">Eliminated Agent</p>
        )
      ) : (
        fromGame && <p className="text-black text-2xl ">Selected Agent</p>
      )}

      <div className="flex justify-center w-full">
        <Image
          src={image}
          width={fromGame ? 70 : 100}
          height={fromGame ? 70 : 100}
          alt={name}
        />
      </div>
      <p className={`${fromGame ? "text-xl" : "text-2xl"}  tracking-wide`}>
        {name}
      </p>
      <p className={`${fromGame ? "text-xs" : "text-sm"}   ${museo.className}`}>
        {description}
      </p>
      <div
        className={`flex items-center gap-2 mt-3 w-full overflow-x-scroll agentCardScrollBar pr-1 ${
          fromGame && "flex-wrap"
        }`}
      >
        {traits.map((trait, index) => (
          <p
            key={index}
            className={`${fromGame ? "text-xs" : "text-sm"}  ${
              museo.className
            } bg-white text-black px-3 text-nowrap rounded-md border border-[${borderColor}] ${
              fromGame && "border-[#F50276] "
            }`}
          >
            {trait}
          </p>
        ))}
      </div>
    </div>
  );
};

export default AgentCard;
