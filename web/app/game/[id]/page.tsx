"use client";
import React, { useEffect, useState } from "react";
import AgentCard from "@/components/AgentCard";
import Image from "next/image";
import { agentData } from "@/lib/utils";
import { MuseoModerno } from "next/font/google";
import { GameAgentCard } from "@/components/GameAgentCard";
import { AgentCardProps, SenderType } from "@/lib/interface";
import GameCard from "@/components/GameCard";
import ChatInterface from "@/components/ChatInterface";
import { usePathname } from "next/navigation";
import { wagmiContractConfig } from "@/lib/contract";
import { useReadContract } from "wagmi";

const museo = MuseoModerno({
  subsets: ["latin"],
  weight: ["400"],
});

const GamePage = () => {
  const pathname = usePathname();
  const gameId = pathname.split("/")[2];
  const [temp, setTemp] = useState<number>(0);
  const [selectedAgent, setSelectedAgent] = useState<
    AgentCardProps | undefined
  >(undefined);

  useEffect(() => {
    const interval = setInterval(() => {
      setTemp((prev) => prev + 0.003);
    }, 10);
    return () => clearInterval(interval);
  }, []);

  const { data: activeAgents } = useReadContract({
    ...wagmiContractConfig,
    functionName: "getActiveAgents",
    args: [gameId || ""],
  });

  const { data: gameRoom } = useReadContract({
    ...wagmiContractConfig,
    functionName: "getGameRoomById",
    args: [gameId || ""],
  });

  const { data: eliminatedAgents } = useReadContract({
    ...wagmiContractConfig,
    functionName: "getEliminatedAgents",
    args: [gameId || ""],
  });

  const messages = [
    {
      content: "This is Round 1",
      sender: SenderType.MODERATOR,
      image: "/images/moderator.png",
      name: "Moderator",
    },
    {
      content: "I have completed round 1",
      sender: SenderType.AGENT,
      image: "/images/circle-red-preview.png",
      name: "Agent 1",
    },
    {
      content: "Round 2 has started",
      sender: SenderType.MODERATOR,
      image: "/images/moderator.png",
      name: "Moderator",
    },
    {
      content: "I am ready for round 2",
      sender: SenderType.AGENT,
      image: "/images/square-red-preview.png",
      name: "Agent 2",
    },
    {
      content: "Round 2 is now complete",
      sender: SenderType.MODERATOR,
      image: "/images/moderator.png",
      name: "Moderator",
    },
    {
      content: "I have completed round 2",
      sender: SenderType.AGENT,
      image: "/images/circle-red-preview.png",
      name: "Agent 3",
    },
  ];

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white relative p-10">
      {/* Moderator in the center */}
      <div className=" w-[20%]  h-full flex flex-col rounded-l-lg">
        <div className=" h-[30%] rounded-tl-lg ">
          <GameCard
            gameId={gameRoom?.gameId}
            gameStarted={gameRoom?.gameStarted}
            gameEnded={gameRoom?.gameEnded}
            currentRound={gameRoom?.currentRound}
            activeAgents={activeAgents}
            eliminatedAgents={eliminatedAgents}
          />
        </div>
        <div className="bg-[#131313] h-[70%] border rounded-bl-lg">
          <ChatInterface messages={messages} />
        </div>
      </div>

      <div className="relative w-[60%] h-full border ">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-24 h-24 flex items-center justify-center bg-[#F50276] text-white text-lg font-bold rounded-full shadow-lg  border-4 border-white">
          Moderator
        </div>
        {/* Agent Cards in a circle */}
        <div className="relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-300">
          {activeAgents?.map((agent, index) => {
            const angle = (index / activeAgents.length) * (2 * Math.PI);
            const x = 200 * Math.cos(angle + temp);

            const y = 200 * Math.sin(angle + temp);

            // console.log(
            //   `Index : ${index} \n Angle:  ${angle} \n x: ${x},  y: ${y}`
            // );
            return (
              <div
                key={agent.agentId}
                className="absolute "
                style={{ transform: `translate(${x + 15}px, ${y}px)` }}
              >
                <GameAgentCard
                  agentId={agent.agentId}
                  image={agent.image}
                  name={agent.name}
                  description={agent.description}
                  traits={agent.traits}
                  onClicked={() => setSelectedAgent(agent)}
                />
                {/* Line connecting to moderator */}
              </div>
            );
          })}
        </div>
      </div>

      <div className=" w-[20%]  h-full flex flex-col rounded-r-lg">
        <div className="bg-[#131313] h-fit flex-grow-0  rounded-tr-lg">
          <AgentCard
            agentId={selectedAgent?.agentId}
            name={selectedAgent?.name}
            description={selectedAgent?.description}
            image={selectedAgent?.image}
            traits={selectedAgent?.traits}
            fromGame={true}
          />
        </div>
        <div className="bg-[#131313] flex-1">p</div>
      </div>
    </div>
  );
};

export default GamePage;
