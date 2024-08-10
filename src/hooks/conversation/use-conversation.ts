import {
  onGetChatMessages,
  onGetDomainChatRooms,
  onOwnerSendMessage,
  onRealTimeChat,
  onViewUnReadMessages,
  onGetChatRoomStarred,
  onStarChatRoom,
  onDeleteChatroom,
} from "@/actions/conversation";
import { useChatContext } from "@/context/user-chat-context";
import { getMonthName, pusherClient } from "@/lib/utils";
import {
  ChatBotMessageSchema,
  ConversationSearchSchema,
} from "@/schemas/conversation.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { ref, set, onValue, get } from "firebase/database";
import { database } from "../../lib/firebaseConfig";
import { v4 as uuidv4 } from "uuid";

export const useConversation = () => {
  const { register, watch } = useForm({
    resolver: zodResolver(ConversationSearchSchema),
    mode: "onChange",
  });

  const [chatroomIds, setChatroomIds] = useState<string[]>([]);
  const [activeChatroomId, setActiveChatroomId] = useState<string | undefined>(
    undefined
  );
  const [firebaseChatRoomId, setFirebaseChatRoomId] = useState<any | undefined>(
    undefined
  );

  const addChatroomId = (id: string) => {
    setChatroomIds((prevIds) => [...prevIds, id]);
  };
  const isChatroomIdAlreadyInList = (id: string) => {
    return chatroomIds.includes(id);
  };

  const [loading, setLoading] = useState<boolean>(false);
  const [chatroomStarred, SetChatroomStarred] = useState<boolean>(true);
  const {
    setLoading: loadMessages,
    setChats,
    chatRoom,
    setChatRoom,
  } = useChatContext();
  const [chatRooms, setChatRooms] = useState<
    {
      id: string;
      starred: boolean | undefined;
      createdAt: number | undefined;
      latestMessage: string | undefined;
      seen: boolean | undefined;
    }[]
  >([]);

  type ObjectType = {
    message: string;
    id: string;
    role: "user" | "assistant";
    createdAt: Date;
    seen: boolean;
  };

  const [objectList, setObjectList] = useState<ObjectType[]>([]);

  useEffect(() => {
    const domainId = "0c5b84af-d4a0-472f-a26f-e4953749dd78";
    const fetchChatRooms = async () => {
      setLoading(true);
      try {
        console.log("..............", domainId);

        const response = await fetch(
          `/api/conversations/getChatrooms?domain=${domainId}`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error(`Error retrieving live status: ${response.status}`);
        }

        const data = await response.json();

        response.ok && setChatRooms(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatRooms();
  }, []);
  const onGetActiveChatMessages = async (
    chatroomId: string,
    domainId: string = "0c5b84af-d4a0-472f-a26f-e4953749dd78"
  ) => {
    setChatRoom(chatroomId);
    setActiveChatroomId(chatroomId);

    if (!isChatroomIdAlreadyInList(chatroomId)) {
      addChatroomId(chatroomId);

      try {
        // Attach a domain listener
        const domainRef = ref(
          database,
          `domain/${domainId}/chatrooms/${chatroomId}`
        );

        get(domainRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              console.log("Path exists!");

              setObjectList([]);

              const data = snapshot.val();
              const messages = Object.values(data);
              setFirebaseChatRoomId(messages[1]);
              const innerMessages = Object.values(messages);
              const internalMessages: any = innerMessages[2];

              for (const key in internalMessages) {
                if (internalMessages.hasOwnProperty(key)) {
                  const tempMessageObject = internalMessages[key];
                  const modifiedObject: {
                    message: string;
                    id: string;
                    role: "user" | "assistant";
                    createdAt: Date;
                    seen: boolean;
                  } = {
                    message: tempMessageObject.message,
                    id: tempMessageObject.createdAt.toString(),
                    role:
                      tempMessageObject.role === "user" ? "user" : "assistant",
                    createdAt: new Date(tempMessageObject.createdAt),
                    seen: tempMessageObject.seen,
                  };

                  // objectList.push(modifiedObject);

              console.log("..............", activeChatroomId);

                  setObjectList((prevList) => [...prevList, modifiedObject]);
                }
              }
            } else {
              console.log("Path does not exist!");
              setChats([]);
            }
          })
          .catch((error) => {
            console.error("Error checking path:", error);
          });

        onValue(domainRef, (snapshot) => {});
      } catch (error) {
        console.log(error);
      }
    } else {
      setObjectList([]);

      try {
        const response = await fetch(
          `/api/chatbot/getMessages?domain=${domainId}&chatroom=${chatroomId}`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error(`Error retrieving live status: ${response}`);
        }

        const data = await response.json();
        const messages = Object.values(data);
        const innerMessages = Object.values(messages);
        const internalMessages: any = innerMessages[0];

        for (const key in internalMessages) {
          if (internalMessages.hasOwnProperty(key)) {
            const tempMessages = internalMessages[key];
            if (key === "message" && internalMessages.hasOwnProperty(key)) {
              for (const key in tempMessages) {
                const tempMessageObject = tempMessages[key];

                const modifiedObject: {
                  message: string;
                  id: string;
                  role: "user" | "assistant";
                  createdAt: Date;
                  seen: boolean;
                } = {
                  message: tempMessageObject.message,
                  id: tempMessageObject.createdAt.toString(),
                  role:
                    tempMessageObject.role === "user" ? "user" : "assistant",
                  createdAt: new Date(tempMessageObject.createdAt),
                  seen: tempMessageObject.seen,
                };
                // objectList.push(modifiedObject);
                setObjectList((prevList) => [...prevList, modifiedObject]);
              }
            }
          }
        }
      } catch (error) {
        console.error(error);
        return null;
      }
    }
  };

  useEffect(() => {
    setChats([]);

    loadMessages(false);

    setChats(objectList);
  });

  function updateChatroomId(newChatroomId: string) {
    // Retrieve the previous value
    const prevChatroomId = activeChatroomId;
    console.log("Previous chatroom ID:", prevChatroomId);

    // Update the state instantly with the new value
    setActiveChatroomId(newChatroomId);
    console.log("Active chatroom ID:", activeChatroomId);
  }

  return {
    register,
    chatRooms,
    loading,
    chatroomStarred,
    updateChatroomId,
    onGetActiveChatMessages,
  };
};

export const useChatWindow = () => {
  const { chats, loading, setChats, chatRoom } = useChatContext();

  const messageWindowRef = useRef<HTMLDivElement | null>(null);
  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(ChatBotMessageSchema),
    mode: "onChange",
  });
  const onScrollToBottom = () => {
    messageWindowRef.current?.scroll({
      top: messageWindowRef.current.scrollHeight,
      left: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    onScrollToBottom();
  }, [chats, messageWindowRef]);

  // useEffect(() => {
  //   if (chatRoom) {
  //     pusherClient.subscribe(chatRoom);
  //     pusherClient.bind("realtime-mode", (data: any) => {
  //       setChats((prev) => [...prev, data.chat]);
  //     });

  //     return () => {
  //       pusherClient.unbind("realtime-mode");
  //       pusherClient.unsubscribe(chatRoom);
  //     };
  //   }
  // }, [chatRoom, setChats]);

  const onHandleSentMessageOld = handleSubmit(async (values) => {
    console.log("........................ 20");

    try {
      reset();
      const message = await onOwnerSendMessage(
        chatRoom!,
        values.content,
        "assistant"
      );
      //WIP: Remove this line
      if (message) {
        //remove this
        console.log("------------------------- 22222", message.message[0]);

        setChats((prev) => [...prev, message.message[0]]);

        await onRealTimeChat(
          chatRoom!,
          message.message[0].message,
          message.message[0].id,
          "assistant"
        );
      }
    } catch (error) {
      console.log(error);
    }
  });

  const onHandleSentMessage = handleSubmit(async (values) => {
    const messageId = uuidv4();

    try {
      reset();

      const messageData = {
        message: values.content,
        role: "assistant",
        createdAt: Date.now(),
        seen: false,
      };

      const response = await fetch("/api/chatbot/sendMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domain: "0c5b84af-d4a0-472f-a26f-e4953749dd78",
          chatroom: chatRoom,
          message: values.content,
          role: "assistant",
          messageId: messageId,
        }),
      });

      const data = await response.json();

      // setChats((prev) => [...prev, data.message]);
    } catch (error) {
      console.log(error);
    }
  });

  return {
    messageWindowRef,
    register,
    onHandleSentMessage,
    chats,
    loading,
    chatRoom,
  };
};

export const getChatRoomStar = async (id: string) => {
  try {
    const getStar = await onGetChatRoomStarred(id);
    return getStar;
  } catch (error) {
    console.log(error);
  }
};

// use chatroom ID and the state to update the chatroom table with the 'starred' field set to true or false
export const updateChatroomStar = async (id: string, state: boolean) => {
  try {
    const chatRoom = await onStarChatRoom(id, state);
    return chatRoom;
  } catch (error) {
    console.log(error);
  }
};

// use chatroom ID to delete the chatroom
export const deleteChatRoom = async (id: string) => {
  try {
    const chatRoom = await onDeleteChatroom(id);
    return chatRoom;
  } catch (error) {
    console.log(error);
  }
};

export const useChatTime = (createdAt: Date, roomId: string) => {
  const { chatRoom } = useChatContext();
  const [messageSentAt, setMessageSentAt] = useState<string>();
  const [urgent, setUrgent] = useState<boolean>(false);

  const onSetMessageRecievedDate = () => {
    const dt = new Date(createdAt);
    const current = new Date();
    const currentDate = current.getDate();
    const hr = dt.getHours();
    const min = dt.getMinutes();
    const date = dt.getDate();
    const month = dt.getMonth();
    const difference = currentDate - date;

    if (difference <= 0) {
      setMessageSentAt(`${hr}:${min}${hr > 12 ? "PM" : "AM"}`);
      if (current.getHours() - dt.getHours() < 2) {
        setUrgent(true);
      }
    } else {
      setMessageSentAt(`${date} ${getMonthName(month)}`);
    }
  };

  const onSeenChat = async () => {
    if (chatRoom == roomId && urgent) {
      await onViewUnReadMessages(roomId);
      setUrgent(false);
    }
  };

  useEffect(() => {
    onSeenChat();
  }, [onSeenChat]);

  useEffect(() => {
    onSetMessageRecievedDate();
  }, [onSetMessageRecievedDate]);

  return { messageSentAt, urgent, onSeenChat };
};
