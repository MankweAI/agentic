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

  const domainId = "0c5b84af-d4a0-472f-a26f-e4953749dd78";
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
  }, []);

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
  function attachListenerToChatroom(chatroomData: any): Promise<any> {
    const messagesRef = ref(
      database,
      `domain/${domainId}/chatrooms/${chatroomData.id}/messages`
    );
    const latestMessageQuery = query(messagesRef, limitToLast(1));

    return new Promise((resolve, reject) => {
      onChildAdded(
        latestMessageQuery,
        (snapshot) => {
          const newMessage = snapshot.val();

          // Resolve the promise with the modifiedObject
          // resolve(modifiedObject);
        },
        (error) => {
          // Reject the promise if an error occurs
          reject(error);
        }
      );
    });
  }

  const onGetActiveChatMessages = async (
    chatroomId: string,
    domainId: string = "0c5b84af-d4a0-472f-a26f-e4953749dd78"
  ) => {
    setChatRoom(chatroomId);
    setActiveChatroomId(chatroomId);
    setChats([]);
    setObjectList([])

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

        console.log("...........123 ", modifiedObject);

        setObjectList((prevList) => [...prevList, modifiedObject]);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setChats([]);

    loadMessages(false);

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
