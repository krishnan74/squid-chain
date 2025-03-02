import { AgentEventCardProps } from "@/lib/interface";
import React from "react";

import { MuseoModerno } from "next/font/google";
import Link from "next/link";
import { shortenAddress } from "@/lib/utils";

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
                src={`/images/${event.agentId}.png`}
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

            {event.transactionHash && event.thoughts ? (
              <div>
                <div>
                  <p className="text-white ">Transaction Hash</p>
                  <Link
                    href={`https://explorer.0x4e454175.aurora-cloud.dev/tx/${event.transactionHash}`}
                    target="_blank"
                    className={`text-gray-400 underline font-semibold text-xs ${museo.className}`}
                  >
                    {shortenAddress(event.transactionHash)}
                  </Link>
                </div>
                <div>
                  <p className="text-white ">Thoughts</p>
                  <p className={`text-gray-400 text-xs ${museo.className}`}>
                    {event.thoughts}
                  </p>
                </div>
              </div>
            ) : event.transactionHash ? (
              <div>
                <p className="text-white ">Transaction Hash</p>
                <Link
                  href={`https://explorer.0x4e454175.aurora-cloud.dev/tx/${event.transactionHash}`}
                  target="_blank"
                  className={`text-gray-400 underline font-semibold text-xs ${museo.className}`}
                >
                  {shortenAddress(event.transactionHash)}
                </Link>
              </div>
            ) : event.thoughts ? (
              <div>
                <p className="text-white ">Thoughts</p>
                <p className={`text-gray-400 text-xs ${museo.className}`}>
                  {event.thoughts}
                </p>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentEventCard;
