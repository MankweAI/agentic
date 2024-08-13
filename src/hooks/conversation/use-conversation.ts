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
    setDomainId,
    domainId,
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

  type ChatroomObjectType = {
    id: string;
    starred: boolean | undefined;
    createdAt: number | undefined;
    latestMessage: string | undefined;
    seen: boolean | undefined;
  };

  // console.log("-----Our Domain ID", domainId);

  // const domainId = "0c5b84af-d4a0-472f-a26f-e4953749dd78";
  const [objectList, setObjectList] = useState<ObjectType[]>([]);
  // const [chatroomList, setChatroomList] = useState<ChatroomObjectType[]>([]);
  const chatroomList: any = [];
  let totalChatroomsCount: number = 0;
  const chatrooms: any = [];

  useEffect(() => {
    // Step 1 Attach a listener to the domain and get any newly created chatroomId
    const domainRef = ref(database, `domain/${domainId}`);

    try {
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

  useEffect(() => {}, []);

  function attachListenerToDomain(
    callback: (newChatroomData: ChatroomObjectType) => void
  ) {
    const domainRef = ref(database, `domain/${domainId}/chatrooms`);

    onChildAdded(
      domainRef,
      (childSnapshot) => {
        const rawChatroomData = childSnapshot.val();

        if (rawChatroomData && rawChatroomData.messages) {
          const messageId = Object.keys(rawChatroomData.messages)[0];
          const messageText = rawChatroomData.messages[messageId].message;
          const latestMessage = rawChatroomData.messages[messageId].message;
          const newChatroomData: ChatroomObjectType = {
            latestMessage: latestMessage,
            id: rawChatroomData.id,
            starred: rawChatroomData.starred,
            createdAt: rawChatroomData.createdAt,
            seen: rawChatroomData.seen,
          };

          // Call the callback with newChatroomData
          callback(newChatroomData);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  const onGetActiveChatMessages = async (
    chatroomId: string,
    
  ) => {
    setChatRoom(chatroomId);
    setActiveChatroomId(chatroomId);
    setChats([]);
    setObjectList([]);

    try {
      // Attach a domain listener
      const domainRef = ref(
        database,
        `domain/${domainId}/chatrooms/${chatroomId}/messages`
      );

      onChildAdded(domainRef, (childSnapshot) => {
        const tempMessageObject = childSnapshot.val();
        const modifiedObject: {
          message: string;
          id: string;
          role: "user" | "assistant";
          createdAt: Date;
          seen: boolean;
        } = {
          message: tempMessageObject.message,
          id: childSnapshot.key!,
          role: tempMessageObject.role === "user" ? "user" : "assistant",
          createdAt: new Date(tempMessageObject.createdAt),
          seen: tempMessageObject.seen,
        };


        setObjectList((prevList) => {
          const newList = [...prevList, modifiedObject];
          return newList.sort(
            (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
          );
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setChats([]);

    loadMessages(false);

        console.log("...........123 ", objectList);

    setChats(objectList);
    // setObjectList([])
  });

  function updateChatroomId(newChatroomId: string) {
    // Retrieve the previous value
    const prevChatroomId = activeChatroomId;
    console.log("Previous chatroom ID:", prevChatroomId);

    // Update the state instantly with the new value
    setActiveChatroomId(newChatroomId);
    // console.log("Active chatroom ID:", activeChatroomId);
  }

  const onChangeSeenStatus = async (chatroomId: string, seen: boolean) => {
    const chatroomRef = ref(
      database,
      `domain/${domainId}/chatrooms/${chatroomId}`
    );
    if (!seen) {
      await update(chatroomRef, {
        seen: true,
      });
    }
  };

  const listenToStarredChanges = async (
    callback: (starred: boolean) => void
  ) => {
    try {
      const starredRef = ref(
        database,
        `domain/${domainId}/chatrooms/${activeChatroomId}/starred`
      );

      // Listen to changes in the 'starred' field
      onValue(starredRef, (snapshot) => {
        const starredStatus = snapshot.val();
        callback(starredStatus);
      });
    } catch (error) {
      console.error("Error listening to starred changes:", error);
    }
  };

  return {
    register,
    chatRooms,
    loading,
    chatroomStarred,
    updateChatroomId,
    onChangeSeenStatus,
    onGetActiveChatMessages,
    activeChatroomId,
    setDomainId,
    listenToStarredChanges,
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

  const onHandleSentMessageOld = handleSubmit(async (values) => {
    // console.log("........................ 20");

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
        // console.log("------------------------- 22222", message.message[0]);

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
