"use client";
import React, { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { readContract } from "@wagmi/core";
import { wagmiContractConfig } from "../../lib/contract";
import GameCard from "@/components/GameCard";
import { config } from "@/lib/wagmiConfig";
import { GameCardProps } from "@/lib/interface";

const Explore = () => {
  const { address } = useAccount();
  const [gameRoomsData, setGameRoomsData] = useState<GameCardProps[]>([]);

  const { data: gameRooms } = useReadContract({
    ...wagmiContractConfig,
    functionName: "getGameRoomsByUser",
    //@ts-expect-error
    args: [address],
  });

  useEffect(() => {
    const fetchAgents = async () => {
      if (gameRooms) {
        const updatedGameRooms = await Promise.all(
          gameRooms.map(async (gameRoom) => {
            const activeAgents = await readContract(config, {
              ...wagmiContractConfig,
              functionName: "getActiveAgents",
              args: [gameRoom.gameId],
            });

            const eliminatedAgents = await readContract(config, {
              ...wagmiContractConfig,
              functionName: "getEliminatedAgents",
              args: [gameRoom.gameId],
            });

            return {
              ...gameRoom,
              activeAgents,
              eliminatedAgents,
              fromExplore: true,
            };
          })
        );
        setGameRoomsData(updatedGameRooms);
      }
    };

    fetchAgents();
  }, [gameRooms]);

  return (
    <div className="flex flex-col justify-start items-center  p-6  min-h-screen">
      <h1 className="text-4xl  text-[#F50276]">Explore</h1>
      <h2 className="text-2xl font-semibold text-gray-400">
        {gameRoomsData.length > 0
          ? "Created Game Rooms"
          : "You have not created any game rooms"}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mt-10">
        {gameRoomsData.map((gameRoom, index) => (
          <GameCard key={index} {...gameRoom} />
        ))}
      </div>
    </div>
  );
};

export default Explore;
