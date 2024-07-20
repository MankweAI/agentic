'use client'
import useSideBar from '@/context/use-sidebar'
import React from 'react'
import { Loader } from '../loader'
import { Switch } from '../ui/switch'

type Props = {}

const BreadCrumb = (props: Props) => {
  const {
    chatRoom,
    expand,
    loading,
    onActivateRealtime,
    onExpand,
    page,
    onSignOut,
    realtime,
  } = useSideBar()

  // console.log("chatRoom data in bread-crumb", chatRoom);
  
  return (
    <div className="flex flex-col ">
      <div className="flex gap-5 items-center">
        <h2 className="text-3xl font-bold capitalize">{page}</h2>
        {page === "conversation" && chatRoom && (
          <Loader loading={loading} className="p-0 inline">
            <Switch
              defaultChecked={realtime}
              onClick={(e) => onActivateRealtime(e)}
              className="data-[state=checked]:bg-[#00E525] data-[state=unchecked]:bg-gray-300"
            />
          </Loader>
        )}
      </div>
      <p className="text-gray-500 text-sm">
        {page == "settings"
          ? "Manage your account settings, preferences and integrations"
          : page == "dashboard"
          ? "A detailed overview of your metrics, usage, customers and more"
          : page == "appointment"
          ? "View and edit all your appointments"
          : page == "integration"
          ? "Connect third-party applications into Agentic-AI"
          : "Chat to your customers in real-time"}
      </p>
    </div>
  );
}

export default BreadCrumb
