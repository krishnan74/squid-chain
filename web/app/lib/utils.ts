import { AgentCardProps } from "./interface";

export const agentData = [
  {
    id: 1,
    name: "Player 001",
    description: "The mysterious elderly contestant with a hidden agenda.",
    image: "/images/circle-red-preview.png",
    traits: ["Mastermind", "Deceptively Weak", "Cunning"],
  },
  {
    id: 2,
    name: "Player 067",
    description: "A determined North Korean defector, skilled in survival.",
    image: "/images/triangle-red-preview.png",
    traits: ["Resourceful", "Brave", "Elusive"],
  },
  {
    id: 3,
    name: "Player 456",
    description:
      "The desperate but kind-hearted protagonist with a gambler's luck.",
    image: "/images/circle-red-preview.png",
    traits: ["Lucky", "Empathetic", "Unpredictable"],
  },
  {
    id: 4,
    name: "Player 218",
    description:
      "A brilliant but morally conflicted strategist, willing to do anything to win.",
    image: "/images/square-red-preview.png",
    traits: ["Calculating", "Manipulative", "Determined"],
  },
  {
    id: 5,
    name: "Player 199",
    description:
      "A kind-hearted migrant worker with exceptional strength and loyalty.",
    image: "/images/circle-red-preview.png",
    traits: ["Strong", "Trustworthy", "Naïve"],
  },
  {
    id: 6,
    name: "Player 101",
    description:
      "A violent gangster with a short temper and a taste for chaos.",
    image: "/images/triangle-red-preview.png",
    traits: ["Aggressive", "Unpredictable", "Ruthless"],
  },
  {
    id: 7,
    name: "Player 212",
    description: "A loud and unpredictable wildcard who plays mind games.",
    image: "/images/square-red-preview.png",
    traits: ["Manipulative", "Flamboyant", "Survivor"],
  },
  {
    id: 8,
    name: "Player 240",
    description: "A quiet but brave contestant with a tragic backstory.",
    image: "/images/circle-red-preview.png",
    traits: ["Selfless", "Courageous", "Loyal"],
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
