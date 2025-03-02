"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import { IoSparkles } from "react-icons/io5";
import ConnectButton from "@/components/ConnectButton";
import AgentCard from "@/components/AgentCard";
import { IoClose } from "react-icons/io5";
import { PiWarningCircleLight } from "react-icons/pi";
import {
  type BaseError,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { MuseoModerno } from "next/font/google";
import { IoIosAddCircleOutline } from "react-icons/io";

import {
  handleOnDragStart,
  handleDragOver,
  handleOnDrop,
  agentData,
} from "../lib/utils";
import { AgentCardProps } from "../lib/interface";
import { useReadContract } from "wagmi";
import { wagmiContractConfig } from "../lib/contract";
import { v4 as uuidv4 } from "uuid";

const museo = MuseoModerno({
  subsets: ["latin"],
  weight: ["400"],
});

const Home = () => {
  const [agents, setAgents] = React.useState<AgentCardProps[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { data: hash, error, isPending, writeContract } = useWriteContract();
  const [gameId, setGameId] = React.useState<string | undefined>(undefined);
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (isConfirmed) {
      console.log("Game created successfully");
      window.location.href = `/game/${gameId}`;
    }
  }, [isConfirmed]);

  const handleCreateGame = async () => {
    setLoading(true);
    try {
      const gameId = uuidv4();
      setGameId(gameId);
      writeContract({
        ...wagmiContractConfig,
        functionName: "createGameRoom",
        args: [
          agents
            .map((agent) => agent.agentId)
            .filter((id): id is number => id !== undefined),
          gameId,
        ],
      });
    } catch (error) {
      console.error("Error creating game", error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col  items-center p-6  min-h-screen ">
      <Image
        src={"/images/umbrella.png"}
        width={200}
        height={200}
        alt=""
        className="absolute w-72 h-72 inline-block left-[0px] text-gray-800  rotate-[-25deg] opacity-50"
      />
      <Image
        src={"/images/star.png"}
        width={200}
        height={200}
        alt=""
        className="absolute w-96 h-96 inline-block right-[0] bottom-20 text-gray-800 z-0 rotate-[20deg] opacity-50"
      />

      <p className={`text-6xl font-bold mb-4   `}>
        <span className={`text-[#F50276] `}>SQUID</span> CHAIN
      </p>

      <ConnectButton />

      <div
        className={`border-2 border-dashed border-[#FCF5E8]  bg-[#2c2c2c] w-[80%]   rounded-lg flex ${
          agents.length >= 3 ? "justify-start" : "justify-center"
        } gap-5 items-center p-7 overflow-x-scroll overflow-y-hidden shadow-lg agentCardScrollBar `}
        onDrop={(e) => handleOnDrop(e, setAgents)}
        onDragOver={handleDragOver}
      >
        {agents.length > 0 ? (
          agents.map((agent, index) => (
            <div
              className="relative flex p-5 gap-5 border rounded-lg bg-[#131313] border-[#F50276] flex-shrink-0  w-[300px]"
              key={index}
            >
              <IoClose
                className="absolute top-3 right-3 hover:bg-[#FCF5E8] rounded-full hover:text-[#F50276] cursor-pointer"
                size={20}
                onClick={() =>
                  setAgents((prev) => prev.filter((_, i) => i !== index))
                }
              />
              <Image
                src={agent.image || ""}
                width={100}
                height={100}
                className="bg-[#FCF5E8] rounded-lg"
                alt={agent.name || ""}
              />

              <div>
                <p className="text-lg  tracking-wide">{agent.name}</p>
                <p className={`text-xs  ${museo.className}`}>
                  {agent.description}
                </p>
              </div>
            </div>
            // <AgentCard
            //   key={index}
            //   name={agent.name}
            //   description={agent.description}
            //   image={agent.image}
            //   traits={agent.traits}
            // />
          ))
        ) : (
          <div className="flex flex-col justify-center items-center">
            <p className={"text-lg text-[#fff] " + museo.className}>
              Drop your agents here
            </p>
            <IoIosAddCircleOutline size={50} />
          </div>
        )}
      </div>

      <button
        onClick={handleCreateGame}
        disabled={agents.length < 3}
        className={`px-6 py-1 text-md mt-5  rounded-lg ${
          agents.length < 3
            ? "bg-gray-400 text-gray-700 cursor-not-allowed"
            : "bg-[#F50276] text-white hover:bg-[#d40063] cursor-pointer"
        }`}
      >
        Create Game
      </button>

      {hash && <div>Transaction Hash: {hash}</div>}
      {isConfirming && <div>Waiting for confirmation...</div>}
      {isConfirmed && <div>Transaction confirmed.</div>}
      {error && (
        <div>Error: {(error as BaseError).shortMessage || error.message}</div>
      )}

      {agents.length > 0 && agents.length < 3 && (
        <div
          className={`flex gap-3 mt-2 items-center justify-center text-xs text-red-400 ${museo.className} `}
        >
          <PiWarningCircleLight size={20} />
          <p>You need to select at least 3 agents to start the game.</p>
        </div>
      )}

      <div className="w-[92%] absolute bottom-0 ">
        <p className="text-2xl  mb-4">Agents List</p>
        <div className="flex gap-10 overflow-x-scroll overflow-y-hidden pb-5 ">
          {agentData.map((agent, index) => (
            <AgentCard
              key={index}
              agentId={agent.agentId}
              name={agent.name}
              description={agent.description}
              image={agent.image}
              onDragStart={(e) => handleOnDragStart(e, agent)}
              traits={agent.traits}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
