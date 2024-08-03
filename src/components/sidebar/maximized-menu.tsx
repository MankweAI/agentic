import { SIDE_BAR_MENU } from "@/constants/menu";
import { ONLINE_STATUS_MENU } from "@/constants/menu";

import { LogOut, Menu, MonitorSmartphone, ChevronLeft } from "lucide-react";
import Image from "next/image";
import React from "react";
import DomainMenu from "./domain-menu";
import MenuItem from "./menu-item";
import { Loader } from "../loader";
import { useConversation } from "@/hooks/conversation/use-conversation";
import useSideBar from "@/context/use-sidebar";
import { Switch } from "../ui/switch";

type Props = {
  onExpand(): void;
  current: string;
  onSignOut(): void;
  domains:
    | {
        id: string;
        name: string;
        icon: string | null;
      }[]
    | null
    | undefined;
};

const MaxMenu = ({ current, domains, onExpand, onSignOut }: Props) => {
  const {
    register,
    chatRooms,
    loading,
    onGetActiveChatMessages,
    chatroomStarred,
  } = useConversation();

  const { realtime, onActivateRealtime, tempRealTime } = useSideBar();
  return (
    <div className="py-3 px-4 flex flex-col h-full">
      <div className="flex justify-between items-center">
        <Image
          src="/images/named-logo-agentic.png"
          alt="LOGO"
          sizes="100vw"
          className="animate-fade-in opacity-0 delay-300 fill-mode-forwards"
          style={{
            width: "70%",
            height: "auto",
          }}
          width={0}
          height={0}
        />
        <ChevronLeft
          className="cursor-pointer animate-fade-in opacity-0 delay-300 fill-mode-forwards"
          onClick={onExpand}
        />
      </div>
      <div className="animate-fade-in opacity-0 delay-300 fill-mode-forwards flex flex-col justify-between h-full pt-10">
        <div className="flex flex-col">
          <p className="text-xs text-gray-500 m-3 ">MENU</p>
          {SIDE_BAR_MENU.map((menu, key) => (
            <MenuItem size="max" {...menu} key={key} current={current} />
          ))}

          {domains &&
            domains.map((domain) => (
              <div key={null} className="mt-4">
                <p className="text-xs text-gray-500 mb-3">STATUS</p>
                <div className="flex justify-between w-full gap-5 items-center pr-4">
                  {ONLINE_STATUS_MENU.map((menu, key) => (
                    <MenuItem
                      size="max"
                      {...menu}
                      key={key}
                      current={current}
                    />
                  ))}
                  <Loader loading={loading} className="px-4">
                    <Switch
                      checked={realtime ?? tempRealTime}
                      // checked={realtime ?? tempRealTime}
                      onClick={(e) => onActivateRealtime(e)}
                      className="data-[state=checked]:bg-[#00E525] data-[state=unchecked]:bg-gray-300"
                    />
                  </Loader>
                </div>
              </div>
            ))}

          <DomainMenu domains={domains} />
        </div>
        <div className="flex flex-col">
          <p className="text-xs text-gray-500 mb-3">OPTIONS</p>
          <MenuItem
            size="max"
            label="Sign out"
            icon={<LogOut />}
            onSignOut={onSignOut}
          />
          <MenuItem
            size="max"
            label="Mobile App"
            icon={<MonitorSmartphone />}
          />
        </div>
      </div>
    </div>
  );
};

export default MaxMenu;
