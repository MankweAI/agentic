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
  } = useConversation();

  const { realtime, onActivateRealtime, tempRealTime } = useSideBar();

  console.log("*********************One456", realtime);

  return (
    <div className="py-3 px-0">
      <TabsMenu triggers={TABS_MENU}>
        <TabsContent value="unread">
          <div className="flex justify-between w-full gap-5 items-end pr-4">
            <h2 className="text-xl font-bold capitalize">Live: All</h2>
            <Loader loading={loading} className="px-4">
              <Switch
                checked={realtime ?? tempRealTime}
                // checked={realtime ?? tempRealTime}
                onClick={(e) => onActivateRealtime(e)}
                className="data-[state=checked]:bg-[#00E525] data-[state=unchecked]:bg-gray-300"
              />
            </Loader>
          </div>

          <ConversationSearch domains={domains} register={register} />
          <div className="flex flex-col">
            <Loader loading={loading}>
              {chatRooms.filter((room) => !room.chatRoom[0]?.message[0]?.seen)
                .length ? (
                chatRooms
                  .filter((room) => !room.chatRoom[0]?.message[0]?.seen)
                  .map((room) => (
                    <ChatCard
                      seen={room.chatRoom[0]?.message[0]?.seen}
                      id={room?.chatRoom[0]?.id}
                      onChat={() =>
                        onGetActiveChatMessages(room.chatRoom[0].id)
                      }
                      createdAt={room?.chatRoom[0]?.message[0]?.createdAt}
                      key={room?.chatRoom[0]?.id}
                      title={room.email!}
                      description={room.chatRoom[0]?.message[0]?.message}
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
              {chatRooms
                .sort(
                  (a, b) =>
                    Number(b.chatRoom[0]?.message[0]?.createdAt) -
                    Number(a.chatRoom[0]?.message[0]?.createdAt)
                )
                .map((room) => (
                  <ChatCard
                    seen={room?.chatRoom[0]?.message[0]?.seen}
                    id={room?.chatRoom[0]?.id}
                    onChat={() =>
                      onGetActiveChatMessages(room?.chatRoom[0]?.id)
                    }
                    createdAt={room?.chatRoom[0]?.message[0]?.createdAt}
                    key={room?.chatRoom[0]?.id}
                    title={room?.email!}
                    description={room.chatRoom[0]?.message[0]?.message}
                  />
                ))}
            </Loader>
          </div>
        </TabsContent>
        <TabsContent value="starred">
          <Separator orientation="horizontal" className="mt-5" />
          <div className="flex flex-col">
            <Loader loading={loading}>
              {chatRooms.filter((room) => room.chatRoom[0]?.starred).length ? (
                chatRooms
                  .filter((room) => room.chatRoom[0]?.starred)
                  .map((room) => (
                    <ChatCard
                      seen={room.chatRoom[0].message[0]?.seen}
                      id={room.chatRoom[0].id}
                      onChat={() =>
                        onGetActiveChatMessages(room.chatRoom[0].id)
                      }
                      createdAt={room.chatRoom[0].message[0]?.createdAt}
                      key={room.chatRoom[0].id}
                      title={room.email!}
                      description={room.chatRoom[0].message[0]?.message}
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
