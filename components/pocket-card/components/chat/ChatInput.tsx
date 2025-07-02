"use client";

import { SendIcon, XIcon } from "lucide-react";
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
  return (
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
  );
};
