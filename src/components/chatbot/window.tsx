import { ChatBotMessageProps } from "@/schemas/conversation.schema";
import React, { forwardRef } from "react";
import { UseFormRegister } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import RealTimeMode from "./real-time";
import Image from "next/image";
import TabsMenu from "../tabs/intex";
import { BOT_TABS_MENU } from "@/constants/menu";
import ChatIcon from "@/icons/chat-icon";
import { TabsContent } from "../ui/tabs";
import { Separator } from "../ui/separator";
import Bubble from "./bubble";
import { Responding } from "./responding";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Paperclip, Send } from "lucide-react";
import { Label } from "../ui/label";
import { CardDescription, CardTitle } from "../ui/card";
import Accordion from "../accordian";
import UploadButton from "../upload-button";

type Props = {
  errors: any;
  register: UseFormRegister<ChatBotMessageProps>;
  chats: { role: "assistant" | "user"; content: string; link?: string }[];
  onChat(): void;
  onResponding: boolean;
  domainName: string;
  theme?: string | null;
  textColor?: string | null;
  chatbotIcon?: string | null;

  help?: boolean;
  realtimeMode: boolean | undefined;

  helpdesk: {
    id: string;
    question: string;
    answer: string;
    domainId: string | null;
  }[];
  setChat: React.Dispatch<
    React.SetStateAction<
      {
        role: "user" | "assistant";
        content: string;
        link?: string | undefined;
      }[]
    >
  >;
};

export const BotWindow = forwardRef<HTMLDivElement, Props>(
  (
    {
      errors,
      register,
      chats,
      onChat,
      onResponding,
      domainName,
      helpdesk,
      realtimeMode,
      setChat,
      textColor,
      theme,
      chatbotIcon,
      help,
    },
    ref
  ) => {
    console.log("*********************THREE", textColor);
    
    // Incomplete
    // The chatroom ID in line 104 is set to "chatroom" instead of an ID. Potential bug.

    const colorObject = theme ? JSON.parse(theme) : null;
    const toRgbaString = (color: any) => {
      if (!color) return "rgba(255, 255, 255, 1)"; // Default to white if color is null or undefined
      if (color === "white") return "rgba(255, 255, 255, 1)"; // Return white
      if (color === "black") return "rgba(0, 0, 0, 1)"; // Return black
      return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
    };

    const rgbaColor = toRgbaString(colorObject);

    return (
      <div className="h-[620px] w-[450px] flex flex-col justify-end bg-white rounded-xl border-[1px] overflow-hidden">
        <div
          className="flex justify-center px-4 pt-4"
          style={{
            backgroundColor: rgbaColor,
            backgroundImage: `url(https://ucarecdn.com/bff986e9-01c9-4e73-b290-f8ed6e6abed5/titlebarbackroundagentic.png)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex gap-2 items-center justify-center ">
            <Image
              src={`https://ucarecdn.com/${chatbotIcon}/`}
              alt="bot"
              width={70}
              height={70}
            />
            <div className="flex items-center flex-col">
              <h3 className="text-lg font-bold leading-none pb-2">
                Lebogang - Matlala Attorneys
              </h3>
              {/* <p className="text-sm">{domainName.split(".com")[0]}</p> */}

              {realtimeMode && (
                <RealTimeMode setChats={setChat} chatRoomId={"chatroom"} />
              )}
            </div>
          </div>
        </div>
        <TabsMenu
          triggers={BOT_TABS_MENU}
          className=" bg-transparent border-[1px] border-border m-2 flex justify-center"
        >
          <TabsContent value="chat">
            <Separator orientation="horizontal" />
            <div className="flex flex-col h-full">
              <div
                style={{
                  background: theme || "",
                  color: "black",
                }}
                className="px-3 flex h-[400px] flex-col py-5 gap-3 chat-window overflow-y-auto"
                ref={ref}
              >
                {chats.map((chat, key) => (
                  <Bubble
                    key={key}
                    message={chat}
                    bubbleColor={rgbaColor}
                    textColor={textColor}
                  />
                ))}
                {onResponding && <Responding />}
              </div>
              <form
                onSubmit={onChat}
                className="flex px-3 py-1 flex-col flex-1 bg-porcelain"
              >
                <div className="flex justify-between">
                  <Input
                    {...register("content")}
                    placeholder="Type your message..."
                    className="focus-visible:ring-0 flex-1 p-0 focus-visible:ring-offset-0 bg-porcelain rounded-none outline-none border-none"
                  />
                  <Button type="submit" className="mt-3">
                    <Send />
                  </Button>
                </div>
              </form>
            </div>
          </TabsContent>

          <TabsContent value="helpdesk">
            <div className="h-[460px] overflow-y-auto overflow-x-hidden p-4 flex flex-col gap-4">
              <div>
                <CardTitle>FAQs</CardTitle>
                <CardDescription>
                  Browse from a list of questions people usually ask.
                </CardDescription>
              </div>
              <Separator orientation="horizontal" />

              {helpdesk.map((desk) => (
                <Accordion
                  key={desk.id}
                  trigger={desk.question}
                  content={desk.answer}
                />
              ))}
            </div>
          </TabsContent>
        </TabsMenu>
        <div className="flex justify-center items-end ">
          <p className="text-gray-500 text-xs">Powered By Agentic.co.za</p>
        </div>
      </div>
    );
  }
);

BotWindow.displayName = "BotWindow";
