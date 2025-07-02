"use client";

import pocketlogo from "@/images/pocket-logo.png";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { XIcon } from "lucide-react";

type CardHeaderProps = {
  isChatMode: boolean;
  getSelectedModelName: () => string;
  exitChatMode: () => void;
  setOpen: (open: boolean) => void;
};

export const CardHeader = ({
  isChatMode,
  getSelectedModelName,
  exitChatMode,
  setOpen,
}: CardHeaderProps) => {
  return (
    <div className="flex justify-between px-4 pt-4">
      {!isChatMode && (
        <motion.h2
          className="text-2xl font-semibold text-neutral-700/90 dark:text-neutral-300/90"
          initial={{
            y: 200,
            opacity: 0,
            filter: "blur(10px)",
          }}
          animate={{
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            transition: {
              delay: 1.3,
              duration: 0.5,
              ease: "easeInOut",
              type: "spring",
              stiffness: 100,
              damping: 20,
            },
          }}
          exit={{
            y: 300,
            opacity: 0,
            filter: "blur(10px)",
            transition: {
              duration: 0.7,
              ease: "easeOut",
              type: "spring",
              stiffness: 100,
              damping: 20,
            },
          }}
        >
          Pocket AI
        </motion.h2>
      )}

      <AnimatePresence mode="wait">
        {isChatMode && (
          <motion.h2
            initial={{
              y: 200,
              opacity: 0,
              filter: "blur(10px)",
            }}
            animate={{
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
              transition: {
                delay: 0.3,
                duration: 0.5,
                ease: "easeInOut",
                type: "spring",
                stiffness: 100,
                damping: 20,
              },
            }}
            exit={{
              y: 300,
              opacity: 0,
              filter: "blur(10px)",
              transition: {
                delay: 0.4,
                duration: 1.2,
                ease: "easeOut",
                type: "spring",
                stiffness: 100,
                damping: 20,
              },
            }}
            className="mt-2 flex max-w-[70%] items-center rounded-lg border-neutral-300 px-2 text-xl font-semibold text-wrap text-neutral-700/90 dark:border-neutral-300/90 dark:text-neutral-300/90"
          >
            {getSelectedModelName()}
          </motion.h2>
        )}
      </AnimatePresence>

      <motion.div
        initial={{
          y: 300,
          opacity: 0,
          filter: "blur(10px)",
        }}
        animate={{
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          transition: {
            delay: 0.6,
            duration: 0.6,
            ease: [0.33, 1, 0.68, 1],
            type: "spring",
            stiffness: 100,
            damping: 20,
          },
        }}
        whileHover="hover"
        variants={{
          rest: {
            opacity: 0.98,
            scale: 1,
            gap: "4px",
          },
          hover: {
            opacity: 1,
            scale: 1.05,
            gap: "8px",
          },
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
        }}
        exit={{
          y: 300,
          opacity: 0,
          transition: {
            delay: 0.6,
            duration: 0.6,
            ease: [0.33, 1, 0.68, 1],
            type: "spring",
            stiffness: 100,
            damping: 20,
          },
        }}
        className={cn(
          "flex items-center text-lg",
          "shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgb(0_0_0/0.1),0_4px_6px_-4px_rgb(0_0_0/0.1)]",
          "dark:shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_10px_15px_-3px_rgb(255_255_255/0.1),0_4px_6px_-4px_rgb(255_255_255/0.1)]",
          "rounded-[0.82rem] px-3 py-2 opacity-85",
          "dark:border dark:border-neutral-500/50",
        )}
      >
        <Image
          width={60}
          height={60}
          className="h-8 w-8"
          alt="logo"
          src={pocketlogo}
        />
        <motion.button
          variants={{
            rest: {
              width: 0,
              opacity: 0,
            },
            hover: {
              width: "auto",
              opacity: 1,
            },
          }}
          className="cursor-pointer overflow-hidden"
          onClick={() => {
            if (isChatMode) {
              exitChatMode();
            } else {
              setOpen(false);
            }
          }}
        >
          <XIcon className="ml-1 h-5 w-5 text-neutral-400 dark:text-neutral-300/90" />
        </motion.button>
      </motion.div>
    </div>
  );
};
