import { AgentEventCardProps } from "@/lib/interface";
import React from "react";

const AgentEventCard: React.FC<AgentEventCardProps> = ({
  agentId,
  agentName,
  agentImage,
  eventName,
  eventDescription,
  thoughts,
}) => {
  return (
    <div
      className={`w-full flex flex-col justify-between border p-5 h-full rounded-br-lg`}
    >
      <p className="text-white text-2xl mb-4">System Events</p>
      <div className="flex items-center mb-4">
        <img
          src={agentImage}
          alt={agentName}
          className="w-12 h-12 rounded-full mr-4"
        />
        <div>
          <p className="text-white text-lg">{agentName}</p>
          <p className="text-gray-400 text-sm">ID: {agentId}</p>
        </div>
      </div>
      <div className="mb-4">
        <p className="text-white text-xl">{eventName}</p>
        <p className="text-gray-400">{eventDescription}</p>
      </div>
      <div>
        <p className="text-white text-lg">Thoughts</p>
        <p className="text-gray-400">{thoughts}</p>
      </div>
    </div>
  );
};

export default AgentEventCard;
