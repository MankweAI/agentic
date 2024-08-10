"use client";
import { useToast } from "@/components/ui/use-toast";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useEffect, useState } from "react";
import { useChatContext } from "./user-chat-context";
import {
  onGetConversationMode,
  onToggleRealtime,
} from "@/actions/conversation";
import { useClerk } from "@clerk/nextjs";

const useSideBar = () => {
  const [expand, setExpand] = useState<boolean | undefined>(undefined);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [realtime, setRealtime] = useState<boolean | undefined>(undefined);
  const [tempRealTime, setTempRealTime] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [domainData, setDomainData] = useState<boolean | undefined>(undefined);
  const [test, setTest] = useState<boolean | undefined>(undefined);

  const { chatRoom } = useChatContext();

  const onActivateRealtime = async (e: any, domainId: string) => {
    try {
      const response = await fetch("/api/instantChats/realtimeToggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domainId: domainId,
          liveStatus: e.target.ariaChecked === "true" ? false : true,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setRealtime(data.liveStatus);

        toast({
          title: "Success",
          description: data.message,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onGetCurrentMode = async (domainId: string) => {
    try {
      const response = await fetch(
        `/api/instantChats/getRealtimeStatus?domainId=${domainId}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`Error retrieving live status: ${response.status}`);
      }

      const data = await response.json();

      return data.liveStatus;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const page = pathname?.split("/").pop();
  const { signOut } = useClerk();

  const onSignOut = () => signOut(() => router.push("/auth/sign-in"));

  const onExpand = () => setExpand((prev) => !prev);

  return {
    expand,
    setRealtime,
    onExpand,
    page,
    onSignOut,
    realtime,
    tempRealTime,
    onGetCurrentMode,
    onActivateRealtime,
    chatRoom,
    loading,
    domainData,
  };
};

export default useSideBar;
