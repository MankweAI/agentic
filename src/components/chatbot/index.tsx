'use client'
import { useChatBot } from '@/hooks/chatbot/use-chatbot'
import React from 'react'
import { BotWindow } from './window'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { BotIcon } from '@/icons/bot-icon'
import { X } from "lucide-react";

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



  return (
    <div className="fixed bottom-0 right-0 flex flex-col justify-end items-end gap-4 z-auto">
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
          "rounded-full relative cursor-pointer shadow-md w-14 h-14 flex items-center justify-center bg-gray-700",
          loading ? "invisible" : "visible"
        )}
        onClick={onOpenChatBot}
      >
        {currentBot?.chatBot?.icon && !botOpened ? (
          <Image
            src={`https://ucarecdn.com/${currentBot.chatBot.icon}/`}
            alt="bot"
            fill
          />
        ) : (
          <X className='text-white' />
        )}
      </div>
    </div>
  );
}

export default AiChatBot
