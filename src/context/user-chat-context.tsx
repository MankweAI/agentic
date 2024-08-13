"use client";

import { createContext, useContext, useState } from "react";

type ChatInitialValuesProps = {
  realtime: boolean;
  setRealtime: React.Dispatch<React.SetStateAction<boolean>>;
  domainId: string | undefined;
  setDomainId: React.Dispatch<React.SetStateAction<string | undefined>>;
  chatRoom: string | undefined;
  setChatRoom: React.Dispatch<React.SetStateAction<string | undefined>>;
  chats: {
    message: string;
    id: string;
    role: "assistant" | "user" | null;
    createdAt: Date;
    seen: boolean;
  }[];
  setChats: React.Dispatch<
    React.SetStateAction<
      {
        message: string;
        id: string;
        role: "assistant" | "user" | null;
        createdAt: Date;
        seen: boolean;
      }[]
    >
  >;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChatInitialValues: ChatInitialValuesProps = {
  chatRoom: undefined,
  setChatRoom: () => undefined,
  chats: [],
  setChats: () => undefined,
  loading: false,
  setLoading: () => undefined,
  realtime: false,
  setRealtime: () => undefined,
  domainId: undefined,
  setDomainId: () => undefined,
};

const chatContext = createContext(ChatInitialValues);
const { Provider } = chatContext;

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [chats, setChats] = useState(ChatInitialValues.chats);
  const [loading, setLoading] = useState(ChatInitialValues.loading);
  const [chatRoom, setChatRoom] = useState(ChatInitialValues.chatRoom);
  const [realtime, setRealtime] = useState(ChatInitialValues.realtime);
  const [domainId, setDomainId] = useState(ChatInitialValues.domainId);

  const values = {
    chats,
    setChats,
    loading,
    setLoading,
    chatRoom,
    setChatRoom,
    realtime,
    setRealtime,
    domainId,
    setDomainId,
  };

  return <Provider value={values}>{children}</Provider>;
};

export const useChatContext = () => {
  const state = useContext(chatContext);
  return state;
};
