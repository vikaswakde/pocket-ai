"use client";

import { cn } from "@/lib/utils";
import { Message } from "@ai-sdk/react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { LinkIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MarkdownComponents } from "../MarkdownComponents";

type MessageItemProps = {
  message: Message;
  isLastMessage: boolean;
  status: string;
  expandedReasoning: Record<string, boolean>;
  onToggleReasoning: (messageKey: string) => void;
};

export const MessageItem = ({
  message,
  isLastMessage,
  status,
  expandedReasoning,
  onToggleReasoning,
}: MessageItemProps) => {
  const hasReasoning = message.parts?.some((p) => p.type === "reasoning");
  const sourceParts = message.parts?.filter((p) => p.type === "source");
  const otherParts = message.parts?.filter((p) => p.type !== "source");

  return (
    <motion.div
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
          <div className="mt-2 flex flex-wrap gap-1.5">
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
                  className="flex items-center gap-2 truncate rounded-[32px] p-1 px-2 text-sm text-blue-500 transition-colors hover:bg-black/5 hover:underline dark:hover:bg-white/5 bg-neutral-200/35 dark:bg-neutral-400/20"
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
          const isStreaming = status === "streaming";
          const isCompleted = !isLastMessage || (isLastMessage && !isStreaming);
          const messageKey = `${message.id}-${partIndex}`;
          const isExpanded = expandedReasoning[messageKey];
          const isClipped = isCompleted && !isExpanded;

          return (
            <div
              key={messageKey}
              onClick={() => {
                if (isCompleted) {
                  onToggleReasoning(messageKey);
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
                <div className="absolute bottom-0 left-0 h-6 w-full rounded-[20px] bg-gradient-to-t from-neutral-200/40 to-transparent dark:rounded-[20px] dark:from-neutral-400/15" />
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
};
