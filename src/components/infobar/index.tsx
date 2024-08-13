"use client";

import React from "react";
import BreadCrumb from "./bread-crumb";
import { Card } from "../ui/card";
import { DeleteChatroom } from "./deleteChatroom";
import { Headphones, Star, Trash } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  getChatRoomStar,
  updateChatroomStar,
  deleteChatRoom,
} from "@/hooks/conversation/use-conversation";
import useSideBar from "@/context/use-sidebar";
import { useConversation } from "@/hooks/conversation/use-conversation";
import { useState } from "react";

type Props = {};

const InfoBar = (props: Props) => {
  // const { onChangeStarredStatus } = useConversation();

  const { chatRoom, loading } = useSideBar();
  const tempChatRoom = chatRoom ? chatRoom : null;
  const [chatRoomStarred, setChatRoomStarred] = useState<boolean | null>(null);
  const [starClicked, setStarClicked] = useState<boolean>(false);
  // console.log("chatRoom is null or undefined", domainId);

  if (chatRoom !== null && chatRoom !== undefined) {
    if (loading) {
      getChatRoomStar(chatRoom).then((res) => {
        setChatRoomStarred(res?.starred ?? null);
      });
    }
  }

  const handleStarClick = () => {
    // chatRoom && onChangeStarredStatus(chatRoom, false)
    // chatRoom && updateChatroomStar(chatRoom, !chatRoomStarred);
    // setStarClicked(true);
  };

  // Handle the delete chatroom. Pop up a modal to confirm the delete action before deleting the chatroom
  const handleTrashClick = () => {
    chatRoom && deleteChatRoom(chatRoom);
  };

  return (
    <div className="flex w-full justify-between items-center py-1 mb-8 ">
      <BreadCrumb />

      <div className="flex gap-3 items-center">
        {chatRoomStarred === true || chatRoomStarred === false ? (
          <div>
            <Card className="rounded-xl flex gap-3 py-3 px-4 text-ghost">
              <Trash />

              <Star
                onClick={handleStarClick}
                stroke={chatRoomStarred ? "blue" : "currentColor"}
                fill={chatRoomStarred ? "blue" : "none"}
              />
            </Card>
          </div>
        ) : (
          ""
        )}
        <Avatar>
          <AvatarFallback className="bg-[#C9FFF8] text-white">
            <Headphones color="black" />
          </AvatarFallback>
        </Avatar>
        {/* <Avatar>
          <AvatarImage src="/public/images/profile-pic-agentic.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar> */}
      </div>
    </div>
  );
};

export default InfoBar;
