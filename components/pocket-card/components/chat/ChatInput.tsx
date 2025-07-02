"use client";

import { SendIcon, XIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import TextareaAutosize from "react-textarea-autosize";

type ChatInputProps = {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  input: string;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
  isRateLimited: boolean;
  status: string;
  stop: () => void;
  getSelectedModelName: () => string;
};

export const ChatInput = ({
  handleSubmit,
  inputRef,
  input,
  handleInputChange,
  isRateLimited,
  status,
  stop,
  getSelectedModelName,
}: ChatInputProps) => {
  const isAwaitingResponse = status === "submitted" || status === "streaming";

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2 rounded-br-[32px] rounded-bl-[32px] border border-neutral-200 p-4 dark:border-neutral-500/60 dark:bg-black/50"
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
        className="scrollbar-hide flex-1 resize-none bg-transparent p-1 text-sm outline-none dark:text-white"
        disabled={isAwaitingResponse || isRateLimited}
        maxRows={5}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            handleSubmit(e as any);
          }
        }}
      />
      <AnimatePresence mode="wait">
        {isAwaitingResponse ? (
          <motion.button
            key="stop"
            type="button"
            onClick={() => stop()}
            className="rounded-lg bg-gray-200/45 p-2 text-gray-800 dark:bg-black/45 dark:text-white"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <XIcon size={16} />
          </motion.button>
        ) : (
          <motion.button
            key="send"
            type="submit"
            className="h-fit cursor-pointer rounded-lg bg-gray-200/45 p-2 text-gray-800 dark:bg-gray-900/85 dark:text-white"
            disabled={isAwaitingResponse || !input.trim() || isRateLimited}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{
              x: 10,
              y: 10,
              opacity: 0,
              scale: 0.5,
              transition: {
                duration: 0.5,
                ease: "easeInOut",
              },
            }}
          >
            <SendIcon size={16} className="mx-1" />
          </motion.button>
        )}
      </AnimatePresence>
    </form>
  );
};
