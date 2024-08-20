import React from 'react'
import { Card } from '../ui/card'
import { useRealTime } from '@/hooks/chatbot/use-chatbot'

type Props = {
  chatRoomId: string
  setChats: React.Dispatch<
    React.SetStateAction<
      {
        role: 'user' | 'assistant'
        content: string
        link?: string | undefined
      }[]
    >
  >
}

const RealTimeMode = ({ chatRoomId, setChats }: Props) => {
 useRealTime(chatRoomId, setChats)

  return (
    <Card className="px-1  rounded-full font-semibold text-gray-500 text-xs flex items-center justify-center">
      <span className="w-3 h-3 bg-green-500 rounded-full mr-1"></span>
      Live Chat
    </Card>
  );
}

export default RealTimeMode

export const OffLineMode = () => {

  return (
    <Card className="px-2  rounded-full font-semibold text-gray-500 text-xs flex items-center justify-center ">
      AI ChatBot
    </Card>
  );
};

