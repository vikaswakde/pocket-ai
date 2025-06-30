"use client";

import { Message } from "@ai-sdk/react";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { MessageItem } from "./MessageItem";

type MessageListProps = {
  messages: Message[];
  status: string;
};

export const MessageList = ({ messages, status }: MessageListProps) => {
  const [expandedReasoning, setExpandedReasoning] = useState<
    Record<string, boolean>
  >({});

  const handleToggleReasoning = (messageKey: string) => {
    setExpandedReasoning((prev) => ({
      ...prev,
      [messageKey]: !prev[messageKey],
    }));
  };

  return (
    <AnimatePresence>
      {messages.map((message, index) => (
        <MessageItem
          key={index}
          message={message}
          isLastMessage={index === messages.length - 1}
          status={status}
          expandedReasoning={expandedReasoning}
          onToggleReasoning={handleToggleReasoning}
        />
      ))}
    </AnimatePresence>
  );
};
