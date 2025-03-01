import { ChatInterfaceProps, SenderType } from "@/lib/interface";
import Image from "next/image";
import React from "react";

import { MuseoModerno } from "next/font/google";

const museo = MuseoModerno({
  subsets: ["latin"],
  weight: ["400"],
});

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages }) => {
  return (
    <div className="p-5 h-full rounded-bl-lg">
      <p className="text-2xl mb-3">Chat History</p>

      <div className="flex flex-col gap-5 overflow-y-scroll h-[90%]  agentCardScrollBar">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${
              message.sender == SenderType.MODERATOR
                ? "self-start bg-[#212121] text-gray-100"
                : "self-end bg-[#FCF5E8] text-[#F50276]"
            } border rounded-lg py-1 pl-0 pr-3 flex justify-center items-center`}
          >
            <Image
              src={message.image}
              alt=""
              width={50}
              height={50}
              className="object-contain rounded-lg "
            />
            <div className="">
              <p className="">{message.name}</p>
              <p className={`${museo.className} text-xs text-[#f50277dd]`}>
                {message.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatInterface;
