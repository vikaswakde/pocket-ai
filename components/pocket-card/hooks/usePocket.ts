"use client";

import React, { useEffect, useRef, useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useUserSession } from "./useUserSession";
import { useChatHistory } from "./useChatHistory";
import { useAIModelManager } from "./useAIModelManager";
import { useAIChat } from "./useAIChat";

export const usePocket = () => {
  // UI State
  const [open, setOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState<Id<"chats"> | null>(null);
  const [isChatMode, setIsChatMode] = useState(false);

  // Refs
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const activeChatIdRef = useRef(activeChatId);

  // Custom Hooks
  const { isAuthenticated, isAuthLoading, anonymousId } = useUserSession();
  const {
    selectedModel,
    setSelectedModel,
    expandedModels,
    flatModels,
    getSelectedModelApiId,
    getSelectedModelName,
    handleCardClick: originalHandleCardClick,
  } = useAIModelManager();
  const { createChat, sendMessage, userChats, dbMessages } = useChatHistory(
    anonymousId,
    activeChatId,
    isAuthenticated,
    isAuthLoading,
  );
  const {
    messages,
    input,
    handleInputChange,
    originalHandleSubmit,
    status,
    stop,
    setMessages,
    errorMessage,
    isRateLimited,
    showSignInButton,
    clearChatState,
  } = useAIChat({
    activeChatId,
    activeChatIdRef,
    selectedModelApiId: getSelectedModelApiId(),
    sendMessage,
  });

  // Side effects
  useEffect(() => {
    activeChatIdRef.current = activeChatId;
  }, [activeChatId]);

  useEffect(() => {
    if (dbMessages) {
      setMessages(
        dbMessages.map((m) => ({
          id: m._id,
          role: m.role,
          content: m.content,
          parts: m.parts ?? [{ type: "text", text: m.content }],
        })),
      );
    }
  }, [dbMessages, setMessages]);

  useEffect(() => {
    setOpen(true);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Event Handlers
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input) return;

    let chatId = activeChatId;

    if (!chatId) {
      try {
        const newChatId = await createChat({
          model: getSelectedModelApiId(),
          anonymousId: isAuthenticated ? undefined : (anonymousId ?? undefined),
        });
        chatId = newChatId;
        setActiveChatId(newChatId);
      } catch (error) {
        console.error("Failed to create chat", error);
        // We can enhance error handling here
        return;
      }
    }

    originalHandleSubmit(e);

    sendMessage({
      chatId,
      role: "user",
      content: input,
    });
  };

  const handleCardClick = (modelId: string) => {
    if (isChatMode) return;
    originalHandleCardClick(modelId);
  };

  const handleChatWithModel = (modelId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedModel(modelId);

    const model = flatModels.find((m) => m.id === modelId);
    const modelApiId = model?.apiId;

    const existingChat = userChats?.find((c) => c.model === modelApiId);

    if (existingChat) {
      setActiveChatId(existingChat._id);
    } else {
      setActiveChatId(null);
      setMessages([]);
    }

    setIsChatMode(true);
    clearChatState();
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const exitChatMode = () => {
    setIsChatMode(false);
    setActiveChatId(null);
    setMessages([]);
    clearChatState();
  };

  return {
    open,
    setOpen,
    selectedModel,
    expandedModels,
    isChatMode,
    errorMessage,
    isRateLimited,
    showSignInButton,
    inputRef,
    chatContainerRef,
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    stop,
    getSelectedModelName,
    handleCardClick,
    handleChatWithModel,
    exitChatMode,
  };
};
