"use client";
import useSideBar from "@/context/use-sidebar";
import { cn } from "@/lib/utils";
import React from "react";
import MaxMenu from "./maximized-menu";
import { MinMenu } from "./minimized-menu";
import { useConversation } from "@/hooks/conversation/use-conversation";
import { useChatContext } from "@/context/user-chat-context";
import { useEffect } from "react";

type Props = {
  domains:
    | {
        id: string;
        name: string;
        icon: string;
      }[]
    | null
    | undefined;
};

const SideBar = ({ domains }: Props) => {
  const { expand, onExpand, page, onSignOut } = useSideBar();
  const { setDomainId } = useChatContext();


  useEffect(() => {
    if (domains && domains[0] && domains[0].id) {
      const domainId = domains[0]?.id;
      setDomainId(domainId);
    }
  }, [domains, setDomainId]);

  return (
    <div
      className={cn(
        "bg-cream dark:bg-neutral-950 h-full w-[60px] fill-mode-forwards fixed md:relative",
        expand == undefined && "",
        expand == true
          ? "animate-open-sidebar"
          : expand == false && "animate-close-sidebar"
      )}
    >
      {expand ? (
        <MaxMenu
          domains={domains}
          current={page!}
          onExpand={onExpand}
          onSignOut={onSignOut}
        />
      ) : (
        <MinMenu
          domains={domains}
          onShrink={onExpand}
          current={page!}
          onSignOut={onSignOut}
        />
      )}
    </div>
  );
};

export default SideBar;
