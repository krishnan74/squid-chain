"use client";
import React, { useEffect, useState } from "react";
import AgentCard from "@/components/AgentCard";
import Image from "next/image";
import { agentData } from "@/lib/utils";
import { MuseoModerno } from "next/font/google";
import { GameAgentCard } from "@/components/GameAgentCard";
import {
  AgentCardProps,
  AgentEventCardProps,
  ModeratorResponseResult,
  SenderType,
} from "@/lib/interface";
import GameCard from "@/components/GameCard";
import ChatInterface from "@/components/ChatInterface";
import { usePathname } from "next/navigation";
import { wagmiContractConfig } from "@/lib/contract";
import { useReadContract } from "wagmi";
import AgentEventCard from "@/components/AgentEventCard";
import axios from "axios";

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

  const [messages, setMessages] = useState<
    { content: string; sender: SenderType; image: string; name: string }[]
  >([]);

  const [events, setEvents] = useState<
    {
      agentId: number;
      agentName: string;
      agentImage: string;
      eventName: string;
      eventDescription: string;
      thoughts: string;
      transactionHash?: string;
    }[]
  >([]);

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000); // Splash screen disappears after 3 seconds

    return () => clearTimeout(timer); // Cleanup timer
  }, []);

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

  const sendRound1Request = async () => {
    setMessages((prev) => [
      ...prev,
      {
        content: "Welcome to Round 1",
        sender: SenderType.MODERATOR,
        image: "/images/circle-red-preview.png",
        name: "Moderator",
      },
      {
        content:
          "In Round 1, AI agents are required to send Aurora ETH. The last agent to send their transaction will be eliminated. This round tests the quickness and efficiency of the agents in executing transactions.",
        sender: SenderType.MODERATOR,
        image: "/images/circle-red-preview.png",
        name: "Moderator",
      },
    ]);

    const round1ModeratorResponse = await axios.post("/api/moderator", {
      activeAgents,
      round: "round1",
      gameId,
    });

    console.log(round1ModeratorResponse.data.result);

    const moderatorResponse: ModeratorResponseResult[] =
      round1ModeratorResponse.data.result;

    moderatorResponse.map((response) => {
      const agentName = response.result.tool.player;
      const agentId = response.result.tool.player.split("player")[1];
      setMessages((prev) => [
        ...prev,
        {
          content: response.result.tool.feel,
          sender: SenderType.AGENT,
          image: "/images/circle-red-preview.png",
          name: "Player " + agentId,
        },
      ]);

      setEvents((prev) => [
        ...prev,
        {
          agentId: Number(agentId),
          agentName: response.result.tool.player,
          agentImage: "/images/circle-red-preview.png",
          eventName: response.eventName,
          eventDescription: response.eventDescription,
          thoughts: response.result.tool.feel,
          transactionHash: response.result.tool.transactionHash,
        },
      ]);
    });
  };

  const sendRound2Request = async () => {
    setMessages((prev) => [
      ...prev,
      {
        content: "Welcome to Round 2",
        sender: SenderType.MODERATOR,
        image: "/images/circle-red-preview.png",
        name: "Moderator",
      },
      {
        content:
          "In Round 2, AI agents are required to send Aurora ETH. The last agent to send their transaction will be eliminated. This round tests the quickness and efficiency of the agents in executing transactions.",
        sender: SenderType.MODERATOR,
        image: "/images/circle-red-preview.png",
        name: "Moderator",
      },
    ]);

    const round2ModeratorResponse = await axios.post("/api/moderator", {
      activeAgents,
      round: "round2",
      gameId,
    });

    console.log(round2ModeratorResponse.data.result);

    const moderatorResponse: ModeratorResponseResult[] =
      round2ModeratorResponse.data.result;

    moderatorResponse.map((response) => {
      const agentName = response.result.tool.player;
      const agentId = response.result.tool.player.split("player")[1];
      setMessages((prev) => [
        ...prev,
        {
          content: response.result.tool.feel,
          sender: SenderType.AGENT,
          image: "/images/circle-red-preview.png",
          name: "Player " + agentId,
        },
      ]);

      setEvents((prev) => [
        ...prev,
        {
          agentId: Number(agentId),
          agentName: response.result.tool.player,
          agentImage: "/images/circle-red-preview.png",
          eventName: response.eventName,
          eventDescription: response.eventDescription,
          thoughts: response.result.tool.feel,
        },
      ]);
    });

    setMessages((prev) => [
      ...prev,
      {
        content: moderatorResponse[0].winner,
        sender: SenderType.MODERATOR,
        image: "/images/circle-red-preview.png",
        name: "Moderator",
      },
    ]);
  };

  const sendRound3Request = async () => {
    setMessages((prev) => [
      ...prev,
      {
        content: "Welcome to Round 3",
        sender: SenderType.MODERATOR,
        image: "/images/circle-red-preview.png",
        name: "Moderator",
      },
      {
        content:
          "In Round 3, AI agents are required to send Aurora ETH. The last agent to send their transaction will be eliminated. This round tests the quickness and efficiency of the agents in executing transactions.",
        sender: SenderType.MODERATOR,
        image: "/images/circle-red-preview.png",
        name: "Moderator",
      },
    ]);

    const round3ModeratorResponse = await axios.post("/api/moderator", {
      activeAgents,
      round: "round3",
      gameId,
    });

    console.log(round3ModeratorResponse.data.result);

    const moderatorResponse: ModeratorResponseResult[] =
      round3ModeratorResponse.data.result;

    moderatorResponse.map((response) => {
      const agentName = response.result.tool.player;
      const agentId = response.result.tool.player.split("player")[1];
      setMessages((prev) => [
        ...prev,
        {
          content: response.result.tool.feel,
          sender: SenderType.AGENT,
          image: "/images/circle-red-preview.png",
          name: "Player " + agentId,
        },
      ]);

      setEvents((prev) => [
        ...prev,
        {
          agentId: Number(agentId),
          agentName: response.result.tool.player,
          agentImage: "/images/circle-red-preview.png",
          eventName: response.eventName,
          eventDescription: response.eventDescription,
          thoughts: response.result.tool.feel,
          transactionHash: response.result.tool.transactionHash,
        },
      ]);
    });

    setMessages((prev) => [
      ...prev,
      {
        content: moderatorResponse[0].winner,
        sender: SenderType.MODERATOR,
        image: "/images/circle-red-preview.png",
        name: "Moderator",
      },
    ]);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white relative p-10">
      {showSplash && (
        <div className="fixed inset-0 flex items-center justify-center bg-black z-50 transition-opacity duration-1000 animate-fadeOut">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-[#F50276]">
              Game Loading...
            </h1>
            <p className="text-gray-400 mt-2">Please wait</p>
          </div>
        </div>
      )}

      {!showSplash && (
        <>
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
            <button
              onClick={sendRound1Request}
              className="bg-[#F50276] text-white p-2 rounded-lg"
            >
              Start Round 1
            </button>

            <button
              onClick={sendRound2Request}
              className="bg-[#F50276] text-white p-2 rounded-lg"
            >
              Start Round 2
            </button>

            <button
              onClick={sendRound3Request}
              className="bg-[#F50276] text-white p-2 rounded-lg"
            >
              Start Round 3
            </button>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-24 h-24 flex items-center justify-center bg-[#F50276] text-white text-lg font-bold rounded-full shadow-lg  border-4 border-white">
              <Image
                src={"/images/moderator.png"}
                width={100}
                height={100}
                alt=""
              />
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
                    {/* Line connecting to circle-red-preview */}
                  </div>
                );
              })}
            </div>
          </div>
          <div className=" w-[20%]  h-full flex flex-col rounded-r-lg">
            <div className=" bg-[#131313] h-[35%] flex-grow-0  rounded-tr-lg">
              <AgentCard
                agentId={selectedAgent?.agentId}
                name={selectedAgent?.name}
                description={selectedAgent?.description}
                image={selectedAgent?.image}
                traits={selectedAgent?.traits}
                fromGame={true}
                onClicked={() => setSelectedAgent(undefined)}
              />
            </div>
            <div className="bg-[#131313] h-[65%] border rounded-br-lg">
              <AgentEventCard
                events={events}
                selectedAgentId={selectedAgent?.agentId}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GamePage;
