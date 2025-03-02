import { AgentEventCardProps } from "@/lib/interface";
import React from "react";

import { MuseoModerno } from "next/font/google";

const museo = MuseoModerno({
  subsets: ["latin"],
  weight: ["400"],
});

const AgentEventCard: React.FC<AgentEventCardProps> = ({
  events,
  selectedAgentId,
}) => {
  const filteredEvents =
    selectedAgentId != undefined
      ? events.filter((event) => event.agentId === selectedAgentId)
      : events;

  return (
    <div className={` p-5 h-full rounded-br-lg`}>
      <p className="text-white text-2xl mb-4">System Events</p>
      <div className="flex flex-col gap-5 overflow-y-scroll h-[90%] agentCardScrollBar">
        {filteredEvents.map((event, index) => (
          <div key={index} className="border rounded-lg p-3">
            <div className="flex items-center mb-4">
              <img
                src={event.agentImage}
                alt={event.agentName}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <p className="text-white text-lg">{event.agentName}</p>
                <p className="text-gray-400 text-sm">ID: {event.agentId}</p>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-white ">{event.eventName}</p>
              <p className={`text-gray-400 text-xs ${museo.className}`}>
                {event.eventDescription}
              </p>
            </div>
            <div>
              <p className="text-white ">Thoughts</p>
              <p className={`text-gray-400 text-xs ${museo.className}`}>
                {event.thoughts}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentEventCard;
