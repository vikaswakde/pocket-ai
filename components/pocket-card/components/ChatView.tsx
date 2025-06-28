"use client";

import { cn } from "@/lib/utils";
import { Message } from "@ai-sdk/react";
import { AlertCircleIcon, SendIcon, XIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type ChatViewProps = {
  chatContainerRef: React.RefObject<HTMLDivElement | null>;
  messages: Message[];
  status: string;
  errorMessage: string | null;
  getSelectedModelName: () => string;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  input: string;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  isRateLimited: boolean;
  stop: () => void;
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
}: ChatViewProps) => {
  const [expandedReasoning, setExpandedReasoning] = useState<
    Record<string, boolean>
  >({});

  return (
    <div className="absolute inset-0 h-full w-full bg-white/35 dark:bg-black/35 rounded-[0.82rem] p-4 flex flex-col">
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto mb-4 scrollbar-hide"
      >
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              className={cn(
                "mb-4 p-3 rounded-[0.82rem] max-w-[90%]",
                message.role === "user"
                  ? "ml-auto bg-gray-200/45 text-gray-800 dark:bg-white/15 dark:text-white"
                  : "bg-transparent text-gray-800 dark:text-white"
              )}
              initial={{ opacity: 0, y: 20, filter: "blur(1.5px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.3 }}
            >
              {message.parts?.map((part, partIndex) => {
                if (part.type === "reasoning") {
                  const isLastMessage = index === messages.length - 1;
                  const isStreaming = status === "streaming";
                  const isCompleted =
                    !isLastMessage || (isLastMessage && !isStreaming);

                  const messageKey = `${message.id}-${partIndex}`;
                  const isExpanded = expandedReasoning[messageKey];
                  const isClipped = isCompleted && !isExpanded;

                  return (
                    <div
                      onClick={() => {
                        if (isCompleted) {
                          setExpandedReasoning((prev) => ({
                            ...prev,
                            [messageKey]: !prev[messageKey],
                          }));
                        }
                      }}
                    >
                      <div
                        className={cn(
                          isCompleted && "cursor-pointer",
                          isClipped && "line-clamp-2 mb-2"
                        )}
                      >
                        <span
                          className={cn(
                            "text-gray-500 dark:text-gray-400",
                            isClipped && "blur-[0.6px]"
                          )}
                        >
                          {part.reasoning}
                        </span>
                      </div>
                      {isClipped && (
                        <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-white/60 to-transparent dark:from-black/60" />
                      )}
                    </div>
                  );
                }
                if (part.type === "text") {
                  return (
                    <div
                      key={partIndex}
                      className={cn(
                        message.role === "assistant" &&
                          "mt-1 border-t pt-2 border-dashed border-neutral-200 dark:border-neutral-500/60"
                      )}
                    >
                      {part.text}
                    </div>
                  );
                }
                return null;
              }) || message.content}
            </motion.div>
          ))}

          {status === "streaming" ||
            (status === "submitted" && (
              <motion.div
                className="inline-block ml-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-500 to-gray-500 animate-pulse text-sm dark:from-white/50 dark:to-white/50">
                    {getSelectedModelName()} is thinking...
                  </span>
                </div>
              </motion.div>
            ))}

          {errorMessage && (
            <motion.div
              className="p-3 rounded-[0.82rem] bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400 flex items-center gap-2 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AlertCircleIcon size={16} />
              <span className="text-sm">{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex gap-2 border border-neutral-200 dark:border-neutral-500/60 rounded-[0.82rem] p-3 bg-white dark:bg-black/50"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder={
            isRateLimited
              ? "You have reached the message limit."
              : `Ask ${getSelectedModelName()} a question...`
          }
          className="flex-1 outline-none text-sm dark:text-white"
          disabled={status !== "ready" || isRateLimited}
        />
        {status === "streaming" ? (
          <button
            type="button"
            onClick={() => stop()}
            className="p-2 rounded-lg bg-gray-200/45 text-gray-800 dark:bg-black/45 dark:text-white"
          >
            <XIcon size={16} />
          </button>
        ) : (
          <button
            type="submit"
            className="p-2 rounded-lg bg-gray-200/45 text-gray-800 dark:bg-gray-900/85 dark:text-white cursor-pointer"
            disabled={status !== "ready" || !input.trim() || isRateLimited}
          >
            <SendIcon size={16} className="mx-1" />
          </button>
        )}
      </form>
    </div>
  );
};
