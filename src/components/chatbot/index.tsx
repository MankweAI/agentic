'use client'
import { useChatBot } from '@/hooks/chatbot/use-chatbot'
import React from 'react'
import { BotWindow } from './window'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { BotIcon } from '@/icons/bot-icon'
import { X } from "lucide-react";
import ChatPopup from './ChatPopUp'
import { useState, useEffect } from 'react'
import ChatbotProfileImage from './ChatbotProfileImage'
import ChatBotIcon from './ChatBotIcon'

type Props = {}

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

  const [botClicked, setBotClicked] = useState<boolean>(false)

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
            <ChatPopup icon={currentBot?.chatBot?.icon} />
          ) : (
            <ChatbotProfileImage
              src={`https://ucarecdn.com/${currentBot?.chatBot?.icon}/`}
            />
          )
        ) : (
          <div className="relative cursor-pointer rounded-full shadow-md w-14 h-14 flex items-center justify-center bg-gray-700">
            {!firebaseRealTimeMode && !botOpened ? <ChatBotIcon /> :<X className="text-white rounded-full " /> }
            
          </div>
        )}
      </div>
    </div>
  );
}

export default AiChatBot
