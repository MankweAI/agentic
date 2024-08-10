"use server";

import { client } from "@/lib/prisma";
import { pusherServer } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs";
import { v4 as uuid } from "uuid";


export const onToggleRealtimeOld = async (id: string, state: boolean) => {
  try {
    const chatRoom = await client.chatRoom.update({
      where: {
        id,
      },
      data: {
        live: state,
      },
      select: {
        id: true,
        live: true,
      },
    });

    if (chatRoom) {
      return {
        status: 200,
        message: chatRoom.live
          ? "Realtime mode enabled"
          : "Realtime mode disabled",
        chatRoom,
      };
    }
  } catch (error) {
    console.log(error);
  }
};

export const onToggleRealtime = async (state: boolean) => {
  const clerkUserId = await currentUser();
  const prismaUserId = await client.user.findFirst({
    where: {
      clerkId: clerkUserId?.id,
    },
    select: {
      id: true,
    },
  });

  if (prismaUserId && prismaUserId?.id.length > 0) {
    // console.log("*********************ONE", prismaUserId?.id);

    try {
      const domain = await client.domain.findUnique({
        where: {
          userId: prismaUserId?.id,
        },
        select: {
          id: true,
          live: true,
        },
      });

      if (domain && domain.id) {
        // console.log("*********************TWO", domain);

        const domainId = domain.id; // Use the retrieved domain ID
        const updatedDomain = await client.domain.update({
          where: {
            id: domainId,
          },
          data: {
            live: state,
          },
          select: {
            id: true,
            live: true,
          },
        });

        if (updatedDomain) {
          // console.log("*********************THREE", updatedDomain.live);

          return {
            status: 200,
            message: updatedDomain.live
              ? "Realtime mode enabled"
              : "Realtime mode disabled",
            domain: updatedDomain,
          };
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
};

export const toggleAllChatRoomsLive = async (state: boolean) => {


  try {
    await client.chatRoom.updateMany({
      data: {
        live: state,
      },
    });

    return {
      status: 200,
      message: state ? "You are live for all visitors" : "Chatbot is online",
    };
  } catch (error) {
    console.log(error);
  }
};

export const onGetConversationMode = async () => {


  const clerkUserId = await currentUser();
  const prismaUserId = await client.user.findFirst({
    where: {
      clerkId: clerkUserId?.id,
    },
    select: {
      id: true,
    },
  });
  if (prismaUserId && prismaUserId?.id.length > 0) {


    try {
      const domain = await client.domain.findUnique({
        where: {
          userId: prismaUserId?.id,
        },
        select: {
          id: true,
          live: true,
        },
      });

      if (domain && domain.id) {

        try {
          const id = domain.id; 
          const mode = await client.domain.findUnique({
            where: {
              id,
            },
            select: {
              live: true,
            },
          });


          return mode;
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
    

      console.log(error);
    }
  }
};

export const onGetDomainChatRooms = async (id: string) => {
  try {
    const domains = await client.domain.findUnique({
      where: {
        id,
      },
      select: {
        customer: {
          select: {
            email: true,
            chatRoom: {
              select: {
                createdAt: true,
                starred: true,
                id: true,
                message: {
                  select: {
                    id: true,
                    message: true,
                    createdAt: true,
                    seen: true,
                  },
                  orderBy: {
                    createdAt: "desc",
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (domains) {
      return domains;
    }
  } catch (error) {
    console.log(error);
  }
};

export const onDeleteChatroom = async (id: string) => {
  try {
    // Delete the chat room
    await client.chatRoom.delete({
      where: {
        id,
      },
    });

    // Delete the messages associated with the chat room
    await client.chatMessage.deleteMany({
      where: {
        chatRoomId: id,
      },
    });

    // Delete customer associated with the chat room
    await client.customer.deleteMany({
      where: {
        id: id,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

// Use chatroom ID to get the 'starred' boolean field from the chatroom table
export const onGetChatRoomStarred = async (id: string) => {
  try {
    const chatRoom = await client.chatRoom.findUnique({
      where: {
        id,
      },
      select: {
        starred: true,
      },
    });

    if (chatRoom) {
      return chatRoom;
    }
  } catch (error) {
    console.log(error);
  }
};

// use chatroom ID to update the chatroom table with the 'starred' field set to true or false depending on the state
export const onStarChatRoom = async (id: string, state: boolean) => {
  try {
    const chatRoom = await client.chatRoom.update({
      where: {
        id,
      },
      data: {
        starred: state,
      },
      select: {
        id: true,
        starred: true,
      },
    });

    if (chatRoom) {
      console.log("Chatroom starred", chatRoom.starred);

      return {
        status: 200,
        message: chatRoom.starred ? "Chatroom starred" : "Chatroom unstarred",
        chatRoomData: chatRoom,
      };
    }
  } catch (error) {
    console.log(error);
  }
};

export const getAllStarredChatrooms = async () => {
  try {
    const starredChatRooms = await client.chatRoom.findMany({
      where: {
        starred: true,
      },
      select: {
        id: true,
        createdAt: true,
        message: {
          select: {
            id: true,
            message: true,
            createdAt: true,
            seen: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    return starredChatRooms;
  } catch (error) {
    console.log(error);
  }
};

export const onGetChatMessages = async (id: string) => {
  try {
    const messages = await client.chatRoom.findMany({
      where: {
        id,
      },
      select: {
        id: true,
        live: true,
        message: {
          select: {
            id: true,
            role: true,
            message: true,
            createdAt: true,
            seen: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (messages) {
      return messages;
    }
  } catch (error) {
    console.log(error);
  }
};

export const onViewUnReadMessages = async (id: string) => {
  try {
    await client.chatMessage.updateMany({
      where: {
        chatRoomId: id,
      },
      data: {
        seen: true,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const onRealTimeChat = async (
  chatroomId: string,
  message: string,
  id: string,
  role: "assistant" | "user"
) => {
  pusherServer.trigger(chatroomId, "realtime-mode", {
    chat: {
      message,
      id,
      role,
    },
  });
};

export const onOwnerSendMessage = async (
  chatroom: string,
  message: string,
  role: "assistant" | "user"
) => {
  try {
    const chat = await client.chatRoom.update({
      where: {
        id: chatroom,
      },
      data: {
        message: {
          create: {
            message,
            role,
          },
        },
      },
      select: {
        message: {
          select: {
            id: true,
            role: true,
            message: true,
            createdAt: true,
            seen: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    if (chat) {
      return chat;
    }
  } catch (error) {
    console.log(error);
  }
};


