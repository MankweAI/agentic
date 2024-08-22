import React from 'react'
import { cn, extractUUIDFromString, getMonthName } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { User, Headset } from "lucide-react";
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react';
import { Bot } from 'lucide-react';

type Props = {
  message: {
    role: "assistant" | "user";
    content: string;
    link?: string;
  };
  createdAt?: Date;
  bubbleColor?: string;
  textColor: string | undefined | null;
  realtimeMode: boolean | undefined;
};

const Bubble = ({
  message,
  createdAt,
  bubbleColor,
  textColor,
  realtimeMode,
}: Props) => {
  const [newCreatedAt, setNewCreatedAt] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (createdAt) {
      const date = new Date(createdAt);
      setNewCreatedAt(date);
      // console.log(date);
    } else {
      setNewCreatedAt(undefined);
    }
  }, [createdAt]);

  let d = new Date();
  // const image = extractUUIDFromString(message.content);
  // console.log(message.link);

  return (
    <div
      className={cn(
        "flex gap-2 items-end",
        message.role == "assistant" ? "self-start" : "self-end flex-row-reverse"
      )}
    >
      {message.role === "assistant" ? (
        realtimeMode ? (
          <Headset />
        ) : (
          <Bot />
        )
      ) : (
        <Avatar className="w-5 h-5">
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "flex flex-col gap-3 min-w-[200px] max-w-[250px] h-auto p-2.5 rounded-t-3xl",
          {
            "bg-muted rounded-r-3xl": message.role === "assistant",
            "rounded-l-3xl": message.role !== "assistant",
          }
        )}
        style={{
          backgroundColor:
            message.role !== "assistant" ? bubbleColor : undefined,
          color:
            message.role !== "assistant" &&
            textColor !== undefined &&
            textColor !== null
              ? textColor
              : undefined,
        }}
      >
        {newCreatedAt ? (
          <div className="flex gap-2 text-xs text-gray-600">
            <p>
              {newCreatedAt.getDate()} {getMonthName(newCreatedAt.getMonth())}
            </p>
            <p>
              {newCreatedAt.getHours()}:{newCreatedAt.getMinutes()}
              {newCreatedAt.getHours() > 12 ? "PM" : "AM"}
            </p>
          </div>
        ) : (
          <p className="text-xs">
            {`${d.getHours()}:${d.getMinutes()} ${
              d.getHours() > 12 ? "pm" : "am"
            }`}
          </p>
        )}
        <p className="text-sm">
          {message.content?.replace("(complete)", " ")}
          {message.link && (
            <Link
              className="underline font-bold pl-2"
              href={message.link}
              target="_blank"
            >
              Your Link
            </Link>
          )}
        </p>
      </div>
    </div>
  );
};

export default Bubble
