"use client";
import { useChatTime } from "@/hooks/conversation/use-conversation";
import React from "react";
import { Card, CardContent, CardDescription } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { User, Mail, MailIcon } from "lucide-react";
import { UrgentIcon } from "@/icons/urgent-icon";
import { MdEmail, MdMarkEmailRead } from "react-icons/md";

type Props = {
  title: string;
  description?: string;
  createdAt: Date;
  id: string;
  onChat(): void;
  seen?: boolean;
  role: string;
};

const ChatCard = ({
  title,
  description,
  createdAt,
  onChat,
  id,
  seen,
  role,
}: Props) => {
  const date = new Date(createdAt);

  const { messageSentAt, urgent } = useChatTime(date, id);

  return (
    <Card
      onClick={onChat}
      className="rounded-none border-r-0 hover:bg-muted cursor-pointer transition duration-150 ease-in-out"
    >
      <CardContent className="py-4 flex gap-3">
        <div>
          <Avatar>
            <AvatarFallback className="bg-muted">
              <User style={{ color: "grey", width: "20px" }} />
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex justify-between w-full">
          <div>
            <div className="flex gap-5 items-center justify-center">
              <CardDescription className="font-bold leading-none text-gray-600">
                {title}
              </CardDescription>
            </div>
            <CardDescription>
              {description
                ? description.substring(0, 40) + "..."
                : "This chatroom is empty"}
            </CardDescription>
          </div>
          <div className="w-[50px] flex flex-col justify-end items-end">
            <CardDescription className="text-xs">
              {date ? messageSentAt : ""}
            </CardDescription>
            {urgent && !seen && role === 'user' ? (
              <MdEmail
                style={{ color: "gold", width: "20px", height: "20px" }}
              />
            ) : (
              <MdMarkEmailRead
                style={{ color: "gray", width: "20px", height: "20px" }}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatCard;
