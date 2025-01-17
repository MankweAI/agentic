"use client"
import { ChatBotMessageProps } from "@/schemas/conversation.schema";
import React, { forwardRef } from "react";
import { UseFormRegister } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import RealTimeMode from "./real-time";
import { OffLineMode } from "./real-time";
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

import Lottie from "lottie-react";
import chatbotAnimation from "../../chatbotAnimation.json";


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
      <div className="h-[522px] sm:h-[600px] md:h-[700px] lg:h-[900px] bg-gray-50 w-full sm:w-[420px] md:w-[600px] lg:w-[450px] flex flex-col justify-start rounded-xl shadow-xl overflow-hidden">
        <div
          className="flex justify-center items-start p-2"
          style={{
            backgroundImage: `url(https://ucarecdn.com/d650ac4c-f3d6-4441-adf6-87493c80181a/titlebarbackroundagentic.png)`,
            backgroundSize: "95% 94%",
            backgroundPosition: "2px center",
            backgroundColor: rgbaColor,
            backgroundRepeat: "no-repeat",
            backgroundOrigin: "padding-box",
            paddingLeft: "20px", // adjust the value to your liking
          }}
        >
          <div className="flex gap-4 items-center justify-start  w-full">
            {realtimeMode ? (
              <Image
                src={`https://ucarecdn.com/${chatbotIcon}/`}
                alt="bot"
                width={50}
                height={50}
                className="rounded-full"
              />
            ) : (
              <div
                className={`relative cursor-pointer rounded-full shadow-md w-10 p-0 h-10 flex items-center justify-center`}
                style={{
                  backgroundColor: rgbaColor,
                }}
              >
                <Lottie
                  animationData={chatbotAnimation}
                  loop={true}
                  autoplay={true}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              </div>
            )}
            <div className="flex items-start flex-col">
              {textColor ? (
                <h3
                  className="text-xl font-bold leading-none pb-2"
                  style={{ color: "#272727" }}
                >
                  {domainName}
                </h3>
              ) : (
                <h3
                  className="text-lg font-bold leading-none pb-2"
                  style={{ color: "black" }}
                >
                  {domainName}
                </h3>
              )}

              {/* <p className="text-sm">{domainName.split(".com")[0]}</p> */}

              {realtimeMode ? (
                <RealTimeMode setChats={setChat} chatRoomId={"chatroom"} />
              ) : (
                <OffLineMode />
              )}
            </div>
            <div></div>
          </div>
        </div>
        <TabsMenu
          triggers={BOT_TABS_MENU}
          className="  border-[1px] border-border m-0 flex justify-center bg-gray-50"
        >
          <TabsContent value="chat">
            {/* <Separator orientation="horizontal" /> */}
            <div className="flex flex-col">
              <div
                style={{
                  background: theme || "",
                  color: "black",
                }}
                className="px-3 flex h-[295px] w-full flex-col py-0 gap-2 chat-window overflow-y-auto bg-gray-50"
                ref={ref}
              >
                {chats.map((chat, key) => (
                  <Bubble
                    key={key}
                    message={chat}
                    bubbleColor={rgbaColor}
                    textColor={textColor}
                    realtimeMode={realtimeMode}
                  />
                ))}
                {onResponding && <Responding />}
              </div>
              <form
                onSubmit={onChat}
                className="flex px-3 w-full h-30px flex-col flex-1 bg-porcelain"
              >
                <div className="flex justify-between items-center">
                  <Input
                    {...register("content")}
                    placeholder="Type your message..."
                    className="focus-visible:ring-0 flex-1 p-0 focus-visible:ring-offset-0 bg-porcelain rounded-none outline-none border-none"
                  />
                  <Button type="submit" className="mt-0">
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
          <p className="text-gray-500 text-xs">Powered by agentic.co.za</p>
        </div>
      </div>
    );
  }
);

BotWindow.displayName = "BotWindow";
