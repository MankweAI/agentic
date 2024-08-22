import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import ChatBotIcon from "./ChatBotIcon";
import { Bot } from 'lucide-react';

export const Responding = () => {
  return (
    <div className="self-start flex items-end gap-3">
      <Bot />
      <div className="chat-bubble">
        <div className="typing">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    </div>
  );
}
