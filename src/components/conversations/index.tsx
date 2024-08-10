"use client";
import { useConversation } from "@/hooks/conversation/use-conversation";
import React from "react";
import TabsMenu from "../tabs/intex";
import { TABS_MENU } from "@/constants/menu";
import { TabsContent } from "../ui/tabs";
import ConversationSearch from "./search";
import { Loader } from "../loader";
import { Switch } from "../ui/switch";
import ChatCard from "./chat-card";
import { CardDescription } from "../ui/card";
import { Separator } from "../ui/separator";
import useSideBar from "@/context/use-sidebar";
import { useEffect, useMemo } from "react";


type Props = {
  domains?:
    | {
        name: string;
        id: string;
        icon: string;
      }[]
    | undefined;
};

const ConversationMenu = ({ domains }: Props) => {
  const {
    register,
    chatRooms,
    loading,
    onGetActiveChatMessages,
    chatroomStarred,
    updateChatroomId,
  } = useConversation();


  const { realtime, onGetCurrentMode, setRealtime } = useSideBar();

  useEffect(() => {

  });

  const unseenChatRooms = useMemo(() => {
    return chatRooms.filter((chatRoom) => !chatRoom?.seen);
  }, [chatRooms]);

  const sortedChatRooms = useMemo(() => {
    return chatRooms.sort(
      (a, b) => Number(b?.createdAt) - Number(a?.createdAt)
    );
  }, [chatRooms]);

  

  // useEffect(() => {

  //   if (realtime === undefined && domains !== null && domains !== undefined) {

  //     onGetCurrentMode(domains[0]?.id).then((liveStatus) => {
  //       setRealtime(liveStatus);
  //     });
  //   }
  // }, [realtime, domains, onGetCurrentMode, setRealtime]);

  return (
    <div className="py-3 px-0">
      <TabsMenu triggers={TABS_MENU}>
        <TabsContent value="unread">
          {/* <div className="flex justify-between w-full gap-5 items-end pr-4">
            <h2 className="text-xl font-bold capitalize">Live: All</h2>
            <Loader loading={loading} className="px-4">
              <Switch
                checked={realtime ?? tempRealTime}
                // checked={realtime ?? tempRealTime}
                onClick={(e) => onActivateRealtime(e)}
                className="data-[state=checked]:bg-[#00E525] data-[state=unchecked]:bg-gray-300"
              />
            </Loader>
          </div> */}

          {/* <ConversationSearch domains={domains} register={register} /> */}
          <div className="flex flex-col">
            <Loader loading={loading}>
              {unseenChatRooms.length ? (
                unseenChatRooms.map((chatRoom: any) => (
                  <ChatCard
                    seen={chatRoom?.seen}
                    id={chatRoom?.id}
                    onChat={() => {
                      onGetActiveChatMessages(chatRoom?.id).then(() => {
                        updateChatroomId(chatRoom?.id); 
                      });
                    }}
                    createdAt={chatRoom?.createdAt}
                    key={chatRoom?.id}
                    title={""}
                    description={chatRoom?.latestMessage}
                  />
                ))
              ) : (
                <CardDescription>
                  No unread chats for your domain
                </CardDescription>
              )}
            </Loader>
          </div>
        </TabsContent>
        <TabsContent value="all">
          <Separator orientation="horizontal" className="mt-5" />
          <div className="flex flex-col">
            <Loader loading={loading}>
              {sortedChatRooms.map((chatRoom) => (
                <ChatCard
                  seen={chatRoom?.seen}
                  id={chatRoom?.id}
                  onChat={() => onGetActiveChatMessages(chatRoom?.id)}
                  createdAt={chatRoom?.createdAt}
                  key={chatRoom.id}
                  title={""}
                  description={chatRoom?.latestMessage}
                />
              ))}
            </Loader>
          </div>
        </TabsContent>
        <TabsContent value="starred">
          <Separator orientation="horizontal" className="mt-5" />
          <div className="flex flex-col">
            <Loader loading={loading}>
              {chatRooms.filter((chatRoom) => chatRoom?.starred === true)
                .length ? (
                chatRooms
                  .filter((chatRoom) => chatRoom?.starred === true)
                  .map((chatRoom) => (
                    <ChatCard
                      seen={chatRoom?.seen}
                      id={chatRoom?.id}
                      onChat={() => {}}
                      createdAt={chatRoom?.createdAt}
                      key={chatRoom.id}
                      title={""}
                      description={chatRoom?.latestMessage}
                    />
                  ))
              ) : (
                <CardDescription>
                  No unread chats for your domain
                </CardDescription>
              )}
            </Loader>
          </div>
        </TabsContent>
      </TabsMenu>
    </div>
  );
};

export default ConversationMenu;
