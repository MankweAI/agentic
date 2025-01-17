"use client";

import React from "react";
import BreadCrumb from "./bread-crumb";
import { Card } from "../ui/card";
import { DeleteChatroom } from "./deleteChatroom";
import { Headphones, Star, Trash } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  updateChatroomStar,
  deleteChatRoom,
  useConversation,
} from "@/hooks/conversation/use-conversation";
import useSideBar from "@/context/use-sidebar";
// import { useConversation } from "@/hooks/conversation/use-conversation";
import { useState } from "react";

type Props = {};

const InfoBar = (props: Props) => {
  // const { listenToStarredChanges } = useConversation();

  const { updateChatroomStarred } = useConversation();
  const { chatRoom, loading } = useSideBar();
  const [chatRoomStarred, setChatRoomStarred] = useState<boolean | null>(null);
  const [starClicked, setStarClicked] = useState<boolean>(false);

const handleStarClick = () => {
  chatRoom && updateChatroomStarred(chatRoom, !starClicked);
  setStarClicked(!starClicked);
};

  // Handle the delete chatroom. Pop up a modal to confirm the delete action before deleting the chatroom
  const handleTrashClick = () => {
    chatRoom && deleteChatRoom(chatRoom);
  };

  return (
    <div className="flex w-full justify-between items-center py-1 mb-8 ">
      <BreadCrumb />

      <div className="flex gap-3 items-center">
        <div>
          <Card className="rounded-xl flex gap-3 py-3 px-4 text-ghost">
            <Trash />

            <Star
              onClick={handleStarClick}
              stroke={starClicked ? "gold" : "currentColor"}
              fill={starClicked ? "gold" : "none"}
            />
          </Card>
        </div>
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
