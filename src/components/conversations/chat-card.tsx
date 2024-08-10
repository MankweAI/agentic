"use client";
import { useChatTime } from "@/hooks/conversation/use-conversation";
import React from "react";
import { Card, CardContent, CardDescription } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { User, Mail, MailIcon } from "lucide-react";
import { UrgentIcon } from "@/icons/urgent-icon";

type Props = {
  title: string;
  description?: string;
  createdAt: number | undefined;
  id: string;
  onChat(): void;
  seen?: boolean;
};

const ChatCard = ({
  title,
  description,
  createdAt,
  onChat,
  id,
  seen,
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
              {urgent && !seen && <UrgentIcon />}
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
            <MailIcon style={{ color: "grey", width: "15px" }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatCard;
