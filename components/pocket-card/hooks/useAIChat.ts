"use client";

import { useChat, Message } from "@ai-sdk/react";
import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
type SendMessageFunction = (options: {
  chatId: Id<"chats">;
  role: "user" | "assistant";
  content: string;
  parts?: Message["parts"];
}) => Promise<unknown>;

interface UseAIChatProps {
  activeChatId: Id<"chats"> | null;
  activeChatIdRef: React.RefObject<Id<"chats"> | null>;
  selectedModelApiId: string;
  sendMessage: SendMessageFunction;
}

export const useAIChat = ({
  activeChatIdRef,
  selectedModelApiId,
  sendMessage,
}: UseAIChatProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [showSignInButton, setShowSignInButton] = useState(false);

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
      model: selectedModelApiId,
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
                  "something went wrong, trying refreshing the page",
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
                "something went wrong, trying refreshing the page",
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

  const clearChatState = () => {
    setErrorMessage(null);
    setIsRateLimited(false);
    setShowSignInButton(false);
  };

  return {
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
  };
};
