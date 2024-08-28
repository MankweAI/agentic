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


  useEffect(() => {
    if (botOpened) {
      setBotClicked(true);
    }
  }, [botOpened]);


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
            <ChatPopup
              icon={currentBot?.chatBot?.icon}
              agentName={currentBot?.chatBot?.agentName}
              theme={currentBot?.chatBot?.background}
            />
          ) : (
            <ChatbotProfileImage
              src={`https://ucarecdn.com/${currentBot?.chatBot?.icon}/`}
              theme={currentBot?.chatBot?.background}
            />
          )
        ) : (
          <div
            className={`relative cursor-pointer rounded-full shadow-md w-[50px] h-[50px] flex items-center justify-center bg-gray-800 ${
              bgColor !== undefined
                ? `bg-[${currentBot?.chatBot?.background}]`
                : ""
            }`}
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
