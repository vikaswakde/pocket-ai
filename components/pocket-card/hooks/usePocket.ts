"use client";

import { aiModels } from "@/data/aiModels";
import { Message, useChat } from "@ai-sdk/react";
import React, { useEffect, useRef, useState } from "react";
import { Model } from "../types";

export const usePocket = () => {
  const [open, setOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [expandedModels, setExpandedModels] = useState<string[]>([]);
  const [isChatMode, setIsChatMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Store chat histories for each model
  const [chatHistories, setChatHistories] = useState<Record<string, Message[]>>(
    {}
  );

  // Get the API ID for the selected model
  const getSelectedModelApiId = () => {
    const flatModels: Model[] = [
      ...aiModels,
      ...aiModels.flatMap((m) => m.children || []),
    ];
    const model = flatModels.find((m) => m.id === selectedModel);
    return model?.apiId || "google/gemma-3-12b-it:free";
  };

  // Get the display name for the selected model
  const getSelectedModelName = () => {
    const flatModels: Model[] = [
      ...aiModels,
      ...aiModels.flatMap((m) => m.children || []),
    ];
    const model = flatModels.find((m) => m.id === selectedModel);
    return model?.name || "AI";
  };

  // Initialize useChat hook with our API endpoint
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    stop,
    setMessages,
  } = useChat({
    api: "/api/chat",
    body: {
      model: getSelectedModelApiId(),
    },
    id: selectedModel || "default", // Use selectedModel as the chat ID to maintain separate chats
    initialMessages: selectedModel ? chatHistories[selectedModel] || [] : [],
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
              setErrorMessage(
                data.error ||
                  "bro i am api credits poor, if you are enjoying this, please dm me on x.com/vikaswakde42"
              );
              setIsRateLimited(true);
            } else {
              setErrorMessage(
                data.error || `Error ${response.status}: ${response.statusText}`
              );
            }
          })
          .catch(() => {
            if (response.status === 429) {
              setErrorMessage(
                "bro i am api credits poor, if you are enjoying this, please dm me on x.com/vikaswakde42"
              );
              setIsRateLimited(true);
            } else {
              setErrorMessage(
                `Error ${response.status}: ${response.statusText}`
              );
            }
          });
      }
    },
    onFinish: () => {
      // Save chat history for this model when a response finishes
      if (selectedModel) {
        setChatHistories((prev) => ({
          ...prev,
          [getSelectedModelApiId()]: messages,
        }));
      }
    },
  });

  // Handle card click - toggle expansion and selection
  const handleCardClick = (modelId: string) => {
    if (isChatMode) return;

    // If the model has children, toggle its expanded state
    const model = aiModels.find((m) => m.id === modelId);
    if (model?.children?.length) {
      setExpandedModels((prev) =>
        prev.includes(modelId) ? prev.filter((id) => id !== modelId) : [modelId]
      );
    }

    // Set as selected model (only for parent models now)
    if (model?.children?.length) {
      setSelectedModel(selectedModel === modelId ? null : modelId);
    }
  };

  // Handle chat button click for a specific model
  const handleChatWithModel = (modelId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering the parent click handler
    setSelectedModel(modelId);

    // If we're already in chat mode and switching models, restore that model's chat history
    if (chatHistories[getSelectedModelApiId()]) {
      setMessages(chatHistories[getSelectedModelApiId()]);
    } else {
      // If this is a new chat, reset messages
      setMessages([]);
    }

    setIsChatMode(true);
    setErrorMessage(null); // Clear any previous errors
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // Exit chat mode
  const exitChatMode = () => {
    // Save current chat history before exiting
    if (selectedModel) {
      setChatHistories((prev) => ({
        ...prev,
        [getSelectedModelApiId()]: messages,
      }));
    }
    setIsChatMode(false);
    setErrorMessage(null); // Clear any errors when exiting chat mode
  };

  // Add effect to set open to true after component mounts
  useEffect(() => {
    setOpen(true);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return {
    open,
    setOpen,
    selectedModel,
    expandedModels,
    isChatMode,
    errorMessage,
    isRateLimited,
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
