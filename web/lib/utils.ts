import { AgentCardProps } from "./interface";
import { clsx, type ClassValue } from "clsx";
import { ethers } from "ethers";
import { twMerge } from "tailwind-merge";
import { wagmiContractConfig } from "./contract";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const shortenAddress = (address: string): string => {
  return address.slice(0, 6) + "..." + address.slice(-4);
};

export const agentData = [
  {
    agentId: 1,
    name: "Player 001",
    description: "The mysterious elderly contestant with a hidden agenda.",
    image: "/images/1.png",
    traits: ["Mastermind", "Deceptively Weak", "Cunning"],
  },
  {
    agentId: 2,
    name: "Player 067",
    description: "A determined North Korean defector, skilled in survival.",
    image: "/images/2.png",
    traits: ["Resourceful", "Brave", "Elusive"],
  },
  {
    agentId: 3,
    name: "Player 456",
    description:
      "The desperate but kind-hearted protagonist with a gambler's luck.",
    image: "/images/3.png",
    traits: ["Lucky", "Empathetic", "Unpredictable"],
  },
  {
    agentId: 4,
    name: "Player 218",
    description:
      "A brilliant but morally conflicted strategist, willing to do anything to win.",
    image: "/images/4.png",
    traits: ["Calculating", "Manipulative", "Determined"],
  },
  {
    agentId: 5,
    name: "Player 199",
    description:
      "A kind-hearted migrant worker with exceptional strength and loyalty.",
    image: "/images/5.png",
    traits: ["Strong", "Trustworthy", "Naïve"],
  },
  {
    agentId: 6,
    name: "Player 101",
    description:
      "A violent gangster with a short temper and a taste for chaos.",
    image: "/images/6.png",
    traits: ["Aggressive", "Unpredictable", "Ruthless"],
  },
];

export function handleOnDragStart(
  e: React.DragEvent<HTMLDivElement>,
  selectedAgent: AgentCardProps
) {
  if (e.dataTransfer) {
    e.dataTransfer.setData("agent", JSON.stringify(selectedAgent));
  }
}

export function handleOnDrop(
  e: React.DragEvent<HTMLDivElement>,
  setAgentData: React.Dispatch<React.SetStateAction<AgentCardProps[]>>
) {
  e.preventDefault();
  if (e.dataTransfer) {
    const agent = JSON.parse(e.dataTransfer.getData("agent"));
    setAgentData((prev) => [...prev, agent]);
  }
}

export function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
  e.preventDefault();
}
