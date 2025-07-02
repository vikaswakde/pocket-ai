"use client";

import { Message } from "@ai-sdk/react";
import { ChatInput } from "./chat/ChatInput";
import { MessageList } from "./chat/MessageList";
import { StatusMessages } from "./chat/StatusMessages";

type ChatViewProps = {
  chatContainerRef: React.RefObject<HTMLDivElement | null>;
  messages: Message[];
  status: string;
  errorMessage: string | null;
  getSelectedModelName: () => string;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  input: string;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
  isRateLimited: boolean;
  stop: () => void;
  showSignInButton?: boolean;
};

export const ChatView = ({
  chatContainerRef,
  messages,
  status,
  errorMessage,
  getSelectedModelName,
  handleSubmit,
  inputRef,
  input,
  handleInputChange,
  isRateLimited,
  stop,
  showSignInButton,
}: ChatViewProps) => {
  return (
    <div className="absolute inset-0 flex h-full w-full flex-col rounded-[32px] bg-white/35 p-4 dark:bg-[#161616]">
      <div
        ref={chatContainerRef}
        className="scrollbar-hide mb-4 flex-1 overflow-y-auto"
      >
        <MessageList messages={messages} status={status} />
        <StatusMessages
          status={status}
          errorMessage={errorMessage}
          getSelectedModelName={getSelectedModelName}
          showSignInButton={showSignInButton}
        />
      </div>

      <ChatInput
        handleSubmit={handleSubmit}
        inputRef={inputRef}
        input={input}
        handleInputChange={handleInputChange}
        isRateLimited={isRateLimited}
        status={status}
        stop={stop}
        getSelectedModelName={getSelectedModelName}
      />
    </div>
  );
};
