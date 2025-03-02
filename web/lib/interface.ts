export interface AgentCardProps {
  agentId: number | undefined;
  name: string | undefined;
  description: string | undefined;
  image: string | undefined;
  traits: readonly string[] | undefined;
  fromGame?: boolean | undefined;
  status?: string;
  onClicked?: () => void;
  onDragStart?: (
    e: React.DragEvent<HTMLDivElement>,
    data: { name: string; description: string; image: string }
  ) => void;
}

export interface ModeratorResponseResult {
  message: string;
  aboutround: string;
  result: {
    message: string;
    tool: {
      feel: string;
      player: string;
      status: string;
      transactionHash: string;
    };
  };
}

export interface AgentEventCardProps {
  agentId: number | undefined;
  agentName: string | undefined;
  agentImage: string | undefined;
  eventName: string | undefined;
  eventDescription: string | undefined;
  thoughts: string | undefined;
}

export interface GameCardProps {
  gameId: string | undefined;
  gameStarted: boolean | undefined;
  gameEnded: boolean | undefined;
  currentRound: number | undefined;
  fromExplore?: boolean | undefined;
  eliminatedAgents?: readonly AgentCardProps[] | undefined;
  activeAgents?: readonly AgentCardProps[] | undefined;
}

export enum SenderType {
  MODERATOR,
  AGENT,
}

export interface ChatInterfaceProps {
  messages: {
    content: string;
    sender: SenderType;
    image: string;
    name: string;
  }[];
}
