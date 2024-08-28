"use client";
import { useChatBot } from "@/hooks/chatbot/use-chatbot";
import React from "react";
import { BotWindow } from "./window";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { BotIcon } from "@/icons/bot-icon";
import { X } from "lucide-react";
import ChatPopup from "./ChatPopUp";
import { useState, useEffect } from "react";
import ChatbotProfileImage from "./ChatbotProfileImage";
import ChatBotIcon from "./ChatBotIcon";
import Lottie from "lottie-react";
import chatbotAnimation from "../../chatbotAnimation.json";


type Props = {};
type Theme = string | undefined | null;


const AiChatBot = (props: Props) => {
  const {
    onOpenChatBot,
    botOpened,
    onChats,
    register,
    onStartChatting,
    onAiTyping,
    messageWindowRef,
    currentBot,
    loading,
    onRealTime,
    setOnChats,
    errors,
    firebaseRealTimeMode,
  } = useChatBot();

  

  const [botClicked, setBotClicked] = useState<boolean>(false);
    const [bgColor, setBgColor] = useState<string>();

const theme: Theme = currentBot?.chatBot?.background;


  useEffect(() => {
    if (botOpened) {
      setBotClicked(true);
    }
  }, [botOpened]);


const colorObject = theme ? JSON.parse(theme) : null;
const toRgbaString = (color: any) => {
  if (!color) return "rgba(255, 255, 255, 1)"; // Default to white if color is null or undefined
  if (typeof color === "string") {
    // Check if color is a string
    if (color === "white") return "rgba(255, 255, 255, 1)"; // Return white
    if (color === "black") return "rgba(0, 0, 0, 1)"; // Return black
  } else if (typeof color === "object" && color !== null) {
    // Check if color is an object
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
  }
  return "rgba(255, 255, 255, 1)"; // Default to white if color is invalid
};

    const rgbaColor = toRgbaString(colorObject);
  

  useEffect(() => {

    if (rgbaColor && rgbaColor !== "rgba(255, 255, 255, 1)") {
      // console.log("---------------------124", rgbaColor);

      setBgColor(rgbaColor);
    }
  }, [rgbaColor]);




  return (
    <div className="fixed bottom-2 right-2 flex flex-col justify-end items-end gap-4 z-auto">
      {botOpened && (
        <BotWindow
          errors={errors}
          setChat={setOnChats}
          realtimeMode={firebaseRealTimeMode}
          helpdesk={currentBot?.helpdesk!}
          domainName={currentBot?.name!}
          ref={messageWindowRef}
          help={currentBot?.chatBot?.helpdesk}
          theme={currentBot?.chatBot?.background}
          textColor={currentBot?.chatBot?.textColor}
          chats={onChats}
          register={register}
          onChat={onStartChatting}
          onResponding={onAiTyping}
          chatbotIcon={currentBot?.chatBot?.icon}
        />
      )}

      <div
        className={cn(
          "cursor-pointer",
          loading ? "invisible" : "slide-in",
          botOpened ? "visible" : ""
        )}
        onClick={onOpenChatBot}
      >
        {currentBot?.chatBot?.icon && !botOpened && firebaseRealTimeMode ? (
          !botClicked ? (
            <ChatPopup icon={currentBot?.chatBot?.icon}  name= {currentBot?.name} />
          ) : (
            <ChatbotProfileImage
              src={`https://ucarecdn.com/${currentBot?.chatBot?.icon}/`}
            />
          )
        ) : (
          <div
            className={`relative cursor-pointer rounded-full shadow-md w-[50px] h-[50px] flex items-center justify-center bg-gray-800 ${bgColor !== undefined ? `bg-[${bgColor}]` : ''}`}
          >
            {!firebaseRealTimeMode && !botOpened ? (
              <Lottie
                animationData={chatbotAnimation}
                loop={true}
                autoplay={true}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            ) : (
              <X className="text-white rounded-full" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AiChatBot;
