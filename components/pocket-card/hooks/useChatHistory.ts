"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export const useChatHistory = (
  anonymousId: string | null,
  activeChatId: Id<"chats"> | null,
  isAuthenticated: boolean,
  isAuthLoading: boolean,
) => {
  const createChat = useMutation(api.chats.createChat);
  const sendMessage = useMutation(api.messages.sendMessage);

  const userChats = useQuery(
    api.chats.getChatsForUser,
    isAuthLoading
      ? "skip"
      : isAuthenticated
        ? {}
        : { anonymousId: anonymousId ?? "skip" },
  );

  const dbMessages = useQuery(
    api.messages.getMessagesForChat,
    activeChatId ? { chatId: activeChatId } : "skip",
  );

  return {
    createChat,
    sendMessage,
    userChats,
    dbMessages,
  };
};
