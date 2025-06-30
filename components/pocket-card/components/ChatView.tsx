"use client";

import { cn } from "@/lib/utils";
import { Message } from "@ai-sdk/react";
import { AlertCircleIcon, LinkIcon, SendIcon, XIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MarkdownComponents } from "./MarkdownComponents";
import TextareaAutosize from "react-textarea-autosize";
import Link from "next/link";

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
    <div className="absolute inset-0 flex h-full w-full flex-col rounded-[32px] bg-white/35 p-4 dark:bg-[#161616]">
      <div
        ref={chatContainerRef}
        className="scrollbar-hide mb-4 flex-1 overflow-y-auto"
      >
        <AnimatePresence>
          {messages.map((message, index) => {
            const hasReasoning = message.parts?.some(
              (p) => p.type === "reasoning",
            );

            const sourceParts = message.parts?.filter(
              (p) => p.type === "source",
            );
            const otherParts = message.parts?.filter(
              (p) => p.type !== "source",
            );

            return (
              <motion.div
                key={index}
                className={cn(
                  "mb-4 max-w-[92%] p-3 dark:rounded-[20px]",
                  message.role === "user"
                    ? "ml-auto rounded-[20px] bg-[#f1f1f3] text-gray-800 dark:bg-white/15 dark:text-white"
                    : "rounded-[23px] border border-neutral-200 text-gray-800 dark:rounded-[20px] dark:border-neutral-500/60 dark:text-white",
                )}
                initial={{ opacity: 0, y: 20, filter: "blur(1.5px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.3 }}
              >
                {sourceParts && sourceParts.length > 0 && (
                  <div className="mb-2 border-b border-dashed border-neutral-100 pb-2 dark:border-neutral-500/60">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <LinkIcon size={16} />
                      <h4 className="font-semibold">Sources</h4>
                    </div>
                    <div className="mt-2 flex flex-col gap-1.5">
                      {sourceParts.map((part, i) => {
                        const source = part.source;
                        const hostname = new URL(source.url).hostname;
                        return (
                          <Link
                            key={i}
                            id={`source-${i}`}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 truncate rounded-md p-1 text-sm text-blue-500 transition-colors hover:bg-black/5 hover:underline dark:hover:bg-white/5"
                            title={source.url}
                          >
                            <Image
                              src={`https://www.google.com/s2/favicons?sz=32&domain=${hostname}`}
                              alt={`${hostname} favicon`}
                              className="h-6 w-6 rounded-full"
                              width={24}
                              height={24}
                            />
                            <span className="truncate">
                              {source.title || new URL(source.url).hostname}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
                {otherParts?.map((part, partIndex) => {
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
                        key={messageKey}
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
                            isClipped && "mb-2 line-clamp-2",
                          )}
                        >
                          <span
                            className={cn(
                              "text-gray-500 dark:text-gray-400",
                              isClipped && "blur-[0.6px]",
                            )}
                          >
                            {part.reasoning}
                          </span>
                        </div>
                        {isClipped && (
                          <div className="absolute bottom-0 left-0 h-6 w-full bg-gradient-to-t from-white/60 to-transparent dark:rounded-[32px] dark:from-black/60" />
                        )}
                      </div>
                    );
                  }
                  if (part.type === "text") {
                    return (
                      <div
                        key={partIndex}
                        className={cn(
                          "dark:text-white/90",
                          message.role === "assistant" &&
                            hasReasoning &&
                            "mt-1 border-t border-dashed border-neutral-100 pt-2 dark:border-neutral-500/60",
                        )}
                      >
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={MarkdownComponents}
                        >
                          {part.text}
                        </ReactMarkdown>
                      </div>
                    );
                  }
                  return null;
                })}
              </motion.div>
            );
          })}

          {status === "streaming" ||
            (status === "submitted" && (
              <motion.div
                className="ml-2 inline-block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative">
                  <span className="animate-pulse bg-gradient-to-r from-gray-500 to-gray-500 bg-clip-text text-sm text-transparent dark:from-white/50 dark:to-white/50">
                    {getSelectedModelName()} is thinking...
                  </span>
                </div>
              </motion.div>
            ))}

          {errorMessage && (
            <motion.div
              className="mb-4 flex items-center gap-2 rounded-[0.82rem] bg-red-100 p-3 text-red-800 dark:bg-red-900/50 dark:text-red-400"
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
        className="flex items-end gap-2 rounded-[0.82rem] border border-neutral-200 p-3 dark:border-neutral-500/60 dark:bg-black/50"
      >
        <TextareaAutosize
          ref={inputRef}
          value={input}
          onChange={handleInputChange}
          placeholder={
            isRateLimited
              ? "You have reached the message limit."
              : `Ask ${getSelectedModelName()} a question...`
          }
          className="scrollbar-hide flex-1 resize-none bg-transparent text-sm outline-none dark:text-white"
          disabled={status !== "ready" || isRateLimited}
          maxRows={5}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              handleSubmit(e as any);
            }
          }}
        />
        {status === "streaming" ? (
          <button
            type="button"
            onClick={() => stop()}
            className="rounded-lg bg-gray-200/45 p-2 text-gray-800 dark:bg-black/45 dark:text-white"
          >
            <XIcon size={16} />
          </button>
        ) : (
          <button
            type="submit"
            className="h-fit cursor-pointer rounded-lg bg-gray-200/45 p-1 text-gray-800 dark:bg-gray-900/85 dark:text-white"
            disabled={status !== "ready" || !input.trim() || isRateLimited}
          >
            <SendIcon size={16} className="mx-1" />
          </button>
        )}
      </form>
    </div>
  );
};
