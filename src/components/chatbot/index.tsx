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

         
  const textColor =  currentBot?.chatBot?.textColor

  const theme = currentBot?.chatBot?.background;
      const colorObject = theme ? JSON.parse(theme) : null;
      const toRgbaString = (color: any) => {
        if (!color) return "rgba(255, 255, 255, 1)"; // Default to white if color is null or undefined
        if (color === "white") return "rgba(255, 255, 255, 1)"; // Return white
        if (color === "black") return "rgba(0, 0, 0, 1)"; // Return black
        return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
      };

      const borderColor = toRgbaString(colorObject);

  const [botClicked, setBotClicked] = useState<boolean>(false);
  const [bgColor, setBgColor] = useState<string>();

  const handleClose = () => {
    // Add logic to hide the popup here
    console.log("Close button clicked!");
    // For example, you can set a state variable to false to hide the popup
    setBotClicked(true);
  };


  useEffect(() => {
    if (botOpened) {
      setBotClicked(true);
    }
  }, [botOpened]);
  


  return (
    <div className="fixed bottom-2  flex flex-col justify-end items-end gap-1 z-auto h-[522px] sm:h-[600px] md:h-[700px] lg:h-[900px] w-full sm:w-[420px] md:w-[600px] lg:w-[450px]">
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
            <div className="chat-popup-container">
              <button className="close-button">×</button>
              <ChatPopup
                icon={currentBot?.chatBot?.icon}
                agentName={currentBot?.chatBot?.agentName}
                theme={currentBot?.chatBot?.background}
              />
            </div>
          ) : (
            <ChatbotProfileImage
              src={`https://ucarecdn.com/${currentBot?.chatBot?.icon}/`}
              theme={currentBot?.chatBot?.background}
            />
          )
        ) : (
          <div
            className={`relative cursor-pointer rounded-full shadow-md w-[50px] h-[50px] flex items-center justify-center bg-gray-800`}
            style={{
              border: `0.2px solid ${borderColor}`,
              backgroundColor: `${borderColor}`,
            }}
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
              <>
                
                {textColor ? (
                  <X className="rounded-full" style={{ color: textColor }} />
                ) : (
                  <X className="rounded-full" style={{ color: "black" }} />
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AiChatBot;
