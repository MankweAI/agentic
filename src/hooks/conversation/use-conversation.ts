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
import {
  ref,
  set,
  onValue,
  get,
  onChildAdded,
  query,
  limitToLast,
  DataSnapshot,
  onChildChanged,
  update,
} from "firebase/database";
import { database } from "../../lib/firebaseConfig";
import { v4 as uuidv4 } from "uuid";

export const useConversation = () => {
  const { register, watch } = useForm({
    resolver: zodResolver(ConversationSearchSchema),
    mode: "onChange",
  });

  const [chatroomIds, setChatroomIds] = useState<string[]>([]);
  // const [activeChatroomId, setActiveChatroomId] = useState<string | undefined>(
  //   undefined
  // );
  const [firebaseChatRoomId, setFirebaseChatRoomId] = useState<any | undefined>(
    undefined
  );

  const addChatroomId = (id: string) => {
    setChatroomIds((prevIds) => [...prevIds, id]);
  };
  const isChatroomIdAlreadyInList = (id: string) => {
    return chatroomIds.includes(id);
  };

  // const [loading, setLoading] = useState<boolean>(false);
  const [chatroomStarred, SetChatroomStarred] = useState<boolean>(true);
  const {
    setLoading: loadMessages,
    setChats,
    chatRoom: chatRoomId,
    setChatRoom,
    chatRoom,
    loading,
    domainId,
  } = useChatContext();
  const [chatRooms, setChatRooms] = useState<
    {
      messageId: string;
      createdAt: Date;
      message: string;
      seen: boolean;
      role: "user" | "assistant";
      chatroomId: string;
    }[]
  >([]);

  type ObjectType = {
    message: string;
    id: string;
    role: "user" | "assistant";
    createdAt: Date;
    seen: boolean;
  };

  type ChatroomObjectType = {
    messageId: string;
    createdAt: Date;
    message: string;
    seen: boolean;
    role: "user" | "assistant";
    chatroomId: string;
  };

  type MessageObjectType = {
    messageId: string;
    createdAt: Date;
    message: string;
    seen: boolean;
    role: "user" | "assistant";
    chatroomId: string;
  };

  const [objectList, setObjectList] = useState<MessageObjectType[]>([]);

  const chatroomList: any = [];
  let totalChatroomsCount: number = 0;
  const chatrooms: any = [];

  useEffect(() => {
    try {
      setChatRooms([]);

      attachListenerToDomain((newChatroomData) => {
        // chatroomList.push(newChatroomData);

        setChatRooms((prevChatRooms) => [
          ...prevChatRooms,
          ...[newChatroomData],
        ]);
      });
    } catch (error) {
      console.error(`Error attaching listener: ${error}`);
    }
  }, [domainId]);

  function attachListenerToDomain(
    callback: (newChatroomData: ChatroomObjectType) => void
  ) {
    const chatRoomRef = ref(database, `domain/${domainId}/chatrooms`);

    // Listen on all new chatrooms.

    // On Child Added: For new chatrooms
    onChildAdded(
      chatRoomRef,
      (childSnapshot) => {
        const rawChatroomData = childSnapshot.val();

        if (rawChatroomData && rawChatroomData.messages) {
          const messageIds = Object.keys(rawChatroomData.messages);
          const latestMessageId = messageIds[messageIds.length - 1]; // Get the last message id
          const role = rawChatroomData.messages[latestMessageId].role

          const newChatroomData: ChatroomObjectType = {
            message: rawChatroomData.messages[latestMessageId].message,
            role: rawChatroomData.messages[latestMessageId].role,
            chatroomId: rawChatroomData.messages[latestMessageId].chatroomId,
            createdAt: rawChatroomData.messages[latestMessageId].createdAt,
            seen: rawChatroomData.messages[latestMessageId].seen,
            messageId: rawChatroomData.messages[latestMessageId].messageId,
          };

          callback(newChatroomData);
        }
      },
      (error) => {
        console.error(error);
      }
    );

    // On Child Changed: For updating existing chatrooms with new messages
    onChildChanged(
      chatRoomRef,
      (childSnapshot) => {
        const rawChatroomData = childSnapshot.val();

        if (rawChatroomData && rawChatroomData.messages) {
          // Get the most recent message added to the chatroom
          const messageIds = Object.keys(rawChatroomData.messages);
          const latestMessageId = messageIds[messageIds.length - 1];

          const newMessageData = {
            message: rawChatroomData.messages[latestMessageId].message,
            role: rawChatroomData.messages[latestMessageId].role,
            chatroomId: rawChatroomData.messages[latestMessageId].chatroomId,
            createdAt: rawChatroomData.messages[latestMessageId].createdAt,
            seen: rawChatroomData.messages[latestMessageId].seen,
            messageId: rawChatroomData.messages[latestMessageId].messageId,
          };

          // Update the chatroom with the new message
          setChatRooms((prevChatRooms) =>
            prevChatRooms.map((chatroom) =>
              chatroom.chatroomId === newMessageData.chatroomId
                ? { ...chatroom, ...newMessageData }
                : chatroom
            )
          );
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  const onGetActiveChatMessages = async (chatroomId: string) => {
    // setChatRoom(chatRoomId);
    setChats([]);
    setObjectList([]);



    try {
      // Attach a domain listener
      const domainRef = ref(
        database,
        `domain/${domainId}/chatrooms/${chatroomId}/messages`
      );

      onValue(
        domainRef,
        (snapshot) => {
          const rawChatroomData = snapshot.val();
            setObjectList(rawChatroomData);

        },
        (error) => {
          console.error(error);
        }
      );
      
    } catch (error) {
      console.log(error);
    }
  };

useEffect(() => {
  if (objectList?.length > 0 && objectList[0].chatroomId === chatRoom) {
    setChats(objectList);
    // setObjectList([]);
  } else {
    // setChats([]);
  }
}, [chatRoom, objectList, setChats]);


  function updateChatroomId(newChatroomId: string) {
    // Retrieve the previous value
    // const prevChatroomId = activeChatroomId;

    // Update the state instantly with the new value

    // setChatRoom(newChatroomId);
  }

  const onUpdateRead = async (
    chatroomId: string,
    messageId: string,
    seen: boolean
  ) => {
      const messagesRef = ref(
        database,
        `domain/${domainId}/chatrooms/${chatroomId}/messages`
      );


    try {

      if (!seen) {
        // Create a reference to the messages path

        // Retrieve the current messages from the reference
        const snapshot = await get(messagesRef);
        if (!snapshot.exists()) {
          console.error("No messages found at the given path.");
          return;
        }

        // Get messages array from snapshot
        const messages = snapshot.val();

        if (!Array.isArray(messages) || messages.length === 0) {
          console.error("No messages available or messages is not an array.");
          return;
        }

        // Determine the index of the last message
        const lastMessageIndex = messages.length - 1;

        // Create a path to the last message
        const lastMessagePath = `${messagesRef}/${lastMessageIndex}`;

        const lastMessageRef = ref(
          database,
          `domain/${domainId}/chatrooms/${chatroomId}/messages/${lastMessageIndex}/`
        );

        // Update the 'seen' value for the last message
        await update(lastMessageRef, { seen: true });
      }

      // console.log("Last message marked as seen.");
    } catch (error) {
      console.error("Error updating last message:", error);
    }
    
  };



  return {
    register,
    chatRooms,
    loading,
    chatroomStarred,
    updateChatroomId,
    onUpdateRead,
    onGetActiveChatMessages,
  
    domainId,
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

  const onHandleSentMessage = handleSubmit(async (values) => {
    const messageId = uuidv4();

    try {
      reset();

      await fetch("/api/chatbot/sendMessage", {
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

// use chatroom ID and the state to update the chatroom table with the 'starred' field set to true or false
export const updateChatroomStar = async (
  domainId: string,
  chatroomId: string,
  starred: boolean
) => {
  try {
    const chatroomRef = ref(
      database,
      `domain/${domainId}/chatrooms/${chatroomId}`
    );
    await update(chatroomRef, {
      starred: true,
    });
  } catch {}
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
