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
    <Card className="px-4 rounded-full py-1 bg-gray-700 font-bold text-white text-sm flex items-center justify-center">
      <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
      Live Chat
    </Card>
  );
}

export default RealTimeMode
