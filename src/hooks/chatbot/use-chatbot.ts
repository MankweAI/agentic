"use client";
import {
  onAiChatBotAssistant,
  onGetCurrentChatBot,
} from "@/actions/bot/indexold";
import { postToParent, pusherClient } from "@/lib/utils";
import {
  ChatBotMessageProps,
  ChatBotMessageSchema,
} from "@/schemas/conversation.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { UploadClient } from "@uploadcare/upload-client";
import { listenForStatusChanges } from "@/pages/api/instantChats/realtimeToggle";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "react-hook-form";
import { ref, set, onValue, onChildAdded } from "firebase/database";
import { database } from "../../lib/firebaseConfig";

const upload = new UploadClient({
  publicKey: process.env.NEXT_PUBLIC_UPLOAD_CARE_PUBLIC_KEY as string,
});

export const useChatBot = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChatBotMessageProps>({
    resolver: zodResolver(ChatBotMessageSchema),
  });
  const [currentBot, setCurrentBot] = useState<
    | {
        name: string;
        live: boolean;
        chatBot: {
          id: string;
          icon: string | null;
          welcomeMessage: string | null;
          background: string | null;
          textColor: string | null;
          helpdesk: boolean;
        } | null;
        helpdesk: {
          id: string;
          question: string;
          answer: string;
          domainId: string | null;
        }[];
      }
    | undefined
  >();
  const messageWindowRef = useRef<HTMLDivElement | null>(null);
  const [botOpened, setBotOpened] = useState<boolean>(false);
  const onOpenChatBot = () => setBotOpened((prev) => !prev);
  const [loading, setLoading] = useState<boolean>(true);
  const [onChats, setOnChats] = useState<
    { role: "assistant" | "user"; content: string; link?: string }[]
  >([]);
  const [onAiTyping, setOnAiTyping] = useState<boolean>(false);
  const [currentBotId, setCurrentBotId] = useState<string>();
  const [firebaseRealTimeMode, setFirebaseRealTimeMode] = useState<boolean>();
  const [firebaseChatRoomId, setFirebaseChatRoomId] = useState<string | null>(
    null
  );

  const [firebaseData, setFirebaseData] = useState<any | undefined>(undefined);

  const [onRealTime, setOnRealTime] = useState<
    { chatroom: string; mode: boolean } | undefined
  >(undefined);

  const onScrollToBottom = () => {
    messageWindowRef.current?.scroll({
      top: messageWindowRef.current.scrollHeight,
      left: 0,
      behavior: "smooth",
    });
  };

  const chatroomId = uuidv4();
  const messageId = uuidv4();

  useEffect(() => {
    onScrollToBottom();
  }, [onChats, messageWindowRef]);

  useEffect(() => {
    postToParent(
      JSON.stringify({
        width: botOpened ? 550 : 80,
        height: botOpened ? 800 : 80,
      })
    );
  }, [botOpened]);

  // Listen for Real time Mode status change in firebaseRealTimeMode
  useEffect(() => {
    listenForStatusChanges(currentBotId, (liveStatus: boolean) => {
      setFirebaseRealTimeMode(liveStatus);
    });
  });

  let limitRequest = 0;

  const onGetDomainChatBot = async (id: string) => {
    setCurrentBotId(id);
    const chatbot = await onGetCurrentChatBot(id);
    if (chatbot) {
      setOnChats((prev) => [
        ...prev,
        {
          role: "assistant",
          content: chatbot.chatBot?.welcomeMessage!,
        },
      ]);

      setCurrentBot(chatbot);
      setLoading(false);
    }
  };

  useEffect(() => {
    window.addEventListener("message", (e) => {
      console.log(e.data);
      const botid = e.data;
      if (limitRequest < 1 && typeof botid == "string") {
        onGetDomainChatBot(botid);
        limitRequest++;
      }
    });
  }, [limitRequest]);

  const onStartChatting = handleSubmit(async (values) => {
    reset();

    if (values.content && !firebaseRealTimeMode) {
      // Step 1
      setOnChats((prev: any) => [
        ...prev,
        {
          role: "user",
          content: values.content,
        },
      ]);

      setOnAiTyping(true);
      // console.log('ALL VALUES', values)

      const response = await onAiChatBotAssistant(
        currentBotId!,
        onChats,
        "user",
        values.content,
        
      );

      if (response) {
        setOnAiTyping(false);

        setOnChats((prev: any) => [...prev, response.response]);
      }
    } else if (values.content && firebaseRealTimeMode) {
      console.log("...chatroomId 11", firebaseChatRoomId);
      console.log("...chatroomId 12", chatroomId);

      const response = await fetch("/api/chatbot/sendMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domain: currentBotId,
          chatroom: firebaseChatRoomId ? firebaseChatRoomId : chatroomId,
          message: values.content,
          role: "user",
          messageId: messageId,
        }),
      });

      if (response.ok) {
        // Attach a domain listener
        const domainRef = ref(
          database,
          `domain/${currentBotId}/chatrooms/${chatroomId}/messages`
        );
        onChildAdded(domainRef, (childSnapshot) => {
          const messageData = childSnapshot.val();

          const messageObject = {
            role: messageData.role,
            content: messageData.message, // Renamed 'message' to 'content'
            createdAt: messageData.createdAt,
          };

          // console.log(".........101", zzzzzzz);

          setOnChats((prevChats) => [...prevChats, messageObject]);
        });
      }

      if (!firebaseChatRoomId) {
        setFirebaseChatRoomId(chatroomId);
      }
    }
  });

  return {
    botOpened,
    onOpenChatBot,
    onStartChatting,
    onChats,
    register,
    firebaseRealTimeMode,
    onAiTyping,
    messageWindowRef,
    currentBot,
    loading,
    setOnChats,
    onRealTime,
    errors,
  };
};

export const useRealTime = (
  chatRoom: string,
  setChats: React.Dispatch<
    React.SetStateAction<
      {
        role: "user" | "assistant";
        content: string;
        link?: string | undefined;
      }[]
    >
  >
) => {
  const counterRef = useRef(1);

  useEffect(() => {
    pusherClient.subscribe(chatRoom);
    pusherClient.bind("realtime-mode", (data: any) => {
      console.log("✅", data);
      if (counterRef.current !== 1) {
        setChats((prev: any) => [
          ...prev,
          {
            role: data.chat.role,
            content: data.chat.message,
          },
        ]);
      }
      counterRef.current += 1;
    });
    return () => {
      pusherClient.unbind("realtime-mode");
      pusherClient.unsubscribe(chatRoom);
    };
  }, [chatRoom, setChats]);
};

// export const useRealTime = (
//   chatRoom: string,
//   setChats: React.Dispatch<
//     React.SetStateAction<
//       {
//         role: "user" | "assistant";
//         content: string;
//         link?: string | undefined;
//       }[]
//     >
//   >
// ) => {
//   const counterRef = useRef(1);

//   useEffect(() => {
//     pusherClient.subscribe(chatRoom);
//     pusherClient.bind("realtime-mode", (data: any) => {
//       console.log("✅", data);
//       if (counterRef.current !== 1) {
//         setChats((prev: any) => [
//           ...prev,
//           {
//             role: data.chat.role,
//             content: data.chat.message,
//           },
//         ]);
//       }
//       counterRef.current += 1;
//     });
//     return () => {
//       pusherClient.unbind("realtime-mode");
//       pusherClient.unsubscribe(chatRoom);
//     };
//   }, [chatRoom, setChats]);
// };
