"use client";

import { aiModels } from "@/data/aiModels";
import { useChat } from "@ai-sdk/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const ANONYMOUS_USER_ID_KEY = "pocket-ai-anonymous-user-id";

export const usePocket = () => {
  // Auth
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();

  // UI State
  const [open, setOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [activeChatId, setActiveChatId] = useState<Id<"chats"> | null>(null);
  const [anonymousId, setAnonymousId] = useState<string | null>(null);
  const [expandedModels, setExpandedModels] = useState<string[]>([]);
  const [isChatMode, setIsChatMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [showSignInButton, setShowSignInButton] = useState(false);

  // Refs
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const activeChatIdRef = useRef(activeChatId);

  // Memoized derived data
  const flatModels = useMemo(
    () => [...aiModels, ...aiModels.flatMap((m) => m.children || [])],
    [],
  );
  const selectedModelInfo = useMemo(
    () => flatModels.find((m) => m.id === selectedModel),
    [flatModels, selectedModel],
  );

  // Convex Hooks
  const createChat = useMutation(api.chats.createChat);
  const sendMessage = useMutation(api.messages.sendMessage);
  const migrateAnonymousChats = useMutation(api.chats.migrateAnonymousChats);

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

  // Anonymous user management
  useEffect(() => {
    if (typeof window !== "undefined" && !isAuthLoading && !isAuthenticated) {
      let anonId = localStorage.getItem(ANONYMOUS_USER_ID_KEY);
      if (!anonId) {
        anonId = crypto.randomUUID();
        localStorage.setItem(ANONYMOUS_USER_ID_KEY, anonId);
      }
      setAnonymousId(anonId);
    }
  }, [isAuthenticated, isAuthLoading]);

  // Chat migration
  useEffect(() => {
    if (typeof window !== "undefined") {
      const anonId = localStorage.getItem(ANONYMOUS_USER_ID_KEY);
      if (isAuthenticated && anonId) {
        migrateAnonymousChats({ anonymousId: anonId }).then(() => {
          localStorage.removeItem(ANONYMOUS_USER_ID_KEY);
          setAnonymousId(null);
        });
      }
    }
  }, [isAuthenticated, migrateAnonymousChats]);

  // Simplified helper functions
  const getSelectedModelApiId = () => {
    return selectedModelInfo?.apiId || "google/gemma-2-12b-it:free";
  };

  const getSelectedModelName = () => {
    return selectedModelInfo?.name || "AI";
  };

  // Vercel AI SDK Chat Hook
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    status,
    stop,
    setMessages,
  } = useChat({
    api: "/api/chat",
    body: {
      model: getSelectedModelApiId(),
    },
    onFinish: (message) => {
      if (activeChatIdRef.current) {
        sendMessage({
          chatId: activeChatIdRef.current,
          role: "assistant",
          content: message.content,
          parts: message.parts,
        });
      }
    },
    onError: (error) => {
      console.error("Chat error:", error);
      setErrorMessage(error.message || "Failed to communicate with AI service");
    },
    onResponse: (response) => {
      // Clear any previous errors when we get a successful response
      setErrorMessage(null);

      if (!response.ok) {
        response
          .json()
          .then((data) => {
            if (response.status === 429) {
              if (data.error === "Sign in to increase limits") {
                setShowSignInButton(true);
              }
              setErrorMessage(
                data.error ||
                  "bro i am api credits poor, if you are enjoying this, please dm me on x.com/vikaswakde42",
              );
              setIsRateLimited(true);
            } else {
              setErrorMessage(
                data.error ||
                  `Error ${response.status}: ${response.statusText}`,
              );
            }
          })
          .catch(() => {
            if (response.status === 429) {
              setErrorMessage(
                "bro i am api credits poor, if you are enjoying this, please dm me on x.com/vikaswakde42",
              );
              setIsRateLimited(true);
            } else {
              setErrorMessage(
                `Error ${response.status}: ${response.statusText}`,
              );
            }
          });
      }
    },
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
        setErrorMessage("Could not start a new chat.");
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

    // If the model has children, toggle its expanded state
    const model = aiModels.find((m) => m.id === modelId);
    if (model?.children?.length) {
      setExpandedModels((prev) =>
        prev.includes(modelId)
          ? prev.filter((id) => id !== modelId)
          : [modelId],
      );
    }

    // Set as selected model (only for parent models now)
    if (model?.children?.length) {
      setSelectedModel(selectedModel === modelId ? null : modelId);
    }
  };

  const handleChatWithModel = (modelId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering the parent click handler
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
    setErrorMessage(null); // Clear any previous errors
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const exitChatMode = () => {
    setIsChatMode(false);
    setActiveChatId(null);
    setMessages([]);
    setErrorMessage(null);
    setIsRateLimited(false);
    setShowSignInButton(false);
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
