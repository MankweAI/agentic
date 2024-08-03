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

  const { chatRoom } = useChatContext();

  const onActivateRealtime = async (e: any) => {
    try {
      setTempRealTime(e.target.ariaChecked == "true" ? false : true);
      const realtime = await onToggleRealtime(
        e.target.ariaChecked == "true" ? false : true
      );
      if (realtime) {
        setRealtime(realtime.domain?.live);
        toast({
          title: "Success",
          description: realtime.message,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onGetCurrentMode = async () => {
    setLoading(true);
    const mode = await onGetConversationMode();

    if (mode) {
      setRealtime(mode.live);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (realtime === undefined) {
      onGetCurrentMode();
    }
  }, [realtime]);

  const page = pathname.split("/").pop();
  const { signOut } = useClerk();

  const onSignOut = () => signOut(() => router.push("/auth/sign-in"));

  const onExpand = () => setExpand((prev) => !prev);

  return {
    expand,
    onExpand,
    page,
    onSignOut,
    realtime,
    tempRealTime,
    onActivateRealtime,
    chatRoom,
    loading,
  };
};

export default useSideBar;
