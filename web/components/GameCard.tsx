import { GameCardProps } from "@/lib/interface";
import React from "react";
import { Skeleton } from "./ui/skeleton";
import { IoCloseCircle, IoCheckmarkCircle } from "react-icons/io5";
import Image from "next/image";
import { MuseoModerno } from "next/font/google";
import { useRouter } from "next/navigation";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import AgentCard from "./AgentCard";

const museo = MuseoModerno({
  subsets: ["latin"],
  weight: ["400"],
});

const GameCard: React.FC<GameCardProps> = ({
  gameId,
  gameStarted,
  gameEnded,
  currentRound,
  activeAgents,
  eliminatedAgents,
  fromExplore,
}) => {
  const router = useRouter();
  if (
    gameId === undefined ||
    gameStarted === undefined ||
    gameEnded === undefined ||
    currentRound === undefined ||
    activeAgents === undefined ||
    eliminatedAgents === undefined
  )
    return (
      <div
        className={`w-full ${
          fromExplore ? "rounded-lg  " : "rounded-tl-lg "
        } h-full flex flex-col justify-between p-6 bg-[#FCF5E8] shadow-lg hover:shadow-2xl transition-all`}
      >
        <Skeleton className="h-6 w-[50%] mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-[90%] mb-2" />
        <div className="mt-4 flex gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />

          <Skeleton className="ml-10 h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </div>
    );

  return (
    <div
      onClick={() => {
        if (fromExplore) {
          router.push(`/game/${gameId}`);
        }
      }}
      className={`w-full ${
        fromExplore ? "rounded-lg cursor-pointer" : "rounded-tl-lg "
      } flex-shrink-0 flex flex-col justify-between p-6 bg-[#FCF5E8] shadow-lg hover:shadow-2xl transition-all `}
    >
      <p className="text-2xl  mb-2 text-[#000] ">Game Room</p>
      <div className={`text-[#F50276] ${museo.className} text-sm`}>
        <p className="mb-2 font-medium">
          Game ID: <span className="font-semibold">{gameId}</span>
        </p>
        <p className="mb-4 font-medium">
          Current Round: <span className="font-semibold">{currentRound}</span>
        </p>
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <IoCheckmarkCircle className="text-green-500" size={28} />
            <div className="flex -space-x-2">
              {activeAgents.map((agent, index) => (
                <Popover>
                  <PopoverTrigger>
                    <Image
                      key={index}
                      src={agent.image || ""}
                      alt={agent.name || ""}
                      width={30}
                      height={30}
                      className="rounded-full border-2 border-white shadow-md"
                    />
                  </PopoverTrigger>
                  <PopoverContent>
                    <AgentCard
                      agentId={agent.agentId}
                      name={agent.name}
                      description={agent.description}
                      image={agent.image}
                      fromGame={true}
                      traits={agent.traits}
                      status="active"
                    />
                  </PopoverContent>
                </Popover>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <IoCloseCircle className="text-red-500" size={28} />
            <div className="flex -space-x-2">
              {eliminatedAgents.map((agent, index) => (
                <Popover>
                  <PopoverTrigger>
                    <Image
                      key={index}
                      src={agent.image || ""}
                      alt={agent.name || ""}
                      width={30}
                      height={30}
                      className="rounded-full border-2 border-white shadow-md"
                    />
                  </PopoverTrigger>
                  <PopoverContent>
                    <AgentCard
                      agentId={agent.agentId}
                      name={agent.name}
                      description={agent.description}
                      image={agent.image}
                      fromGame={true}
                      traits={agent.traits}
                      status="eliminated"
                    />
                  </PopoverContent>
                </Popover>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
