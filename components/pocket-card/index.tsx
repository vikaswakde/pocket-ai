"use client";

import { cn } from "@/lib/utils";
import { GeistSans } from "geist/font/sans";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { usePocket } from "./hooks/usePocket";
import { CardHeader } from "./components/CardHeader";
import { ChatView } from "./components/ChatView";
import { ModelSelectionView } from "./components/ModelSelectionView";

const PocketCard = () => {
  const {
    open,
    setOpen,
    isChatMode,
    getSelectedModelName,
    exitChatMode,
    ...chatProps
  } = usePocket();
  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          className={cn(
            " w-[25rem] md:w-[30rem] min-h-[45rem] h-[45rem]  md:min-h-[48rem] md:h-[48rem] rounded-[0.82rem]",
            "shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgb(0_0_0/0.1),0_4px_6px_-4px_rgb(0_0_0/0.1)]",
            "dark:shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_10px_15px_-3px_rgb(255_255_255/0.1),0_4px_6px_-4px_rgb(255_255_255/0.1)]",
            "p-6 flex flex-col bg-white dark:bg-black/90 border border-neutral-300 dark:border-neutral-700/90",
            GeistSans.className
          )}
          initial={{
            opacity: 0,
            scale: 0.9,
            filter: "blur(10px)",
          }}
          animate={{
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            transition: {
              duration: 1.4,
              ease: "easeOut",
            },
          }}
          exit={{
            opacity: 0,
            scale: 0.9,
            filter: "blur(10px)",
            transition: {
              delay: 1.4,
              duration: 0.5,
              ease: "easeInOut",
            },
          }}
        >
          <CardHeader
            isChatMode={isChatMode}
            getSelectedModelName={getSelectedModelName}
            exitChatMode={exitChatMode}
            setOpen={setOpen}
          />

          {!isChatMode && (
            <motion.p
              className="text-neutral-600/70 text-[15px] leading-5 text-wrap max-w-[52%] -mt-3.5 dark:text-neutral-300/70"
              initial={{
                y: 300,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
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
                transition: {
                  delay: 0.2,
                  duration: 0.7,
                  ease: [0.33, 1, 0.68, 1],
                  type: "spring",
                  stiffness: 100,
                  damping: 8,
                },
              }}
            >
              {isChatMode
                ? `chat with ${getSelectedModelName()}`
                : "A collection of smart AI models."}
            </motion.p>
          )}

          <motion.div
            className="flex-1 mt-8 bg-gray-100 rounded-[0.82rem] border border-dashed border-neutral-300 dark:border-neutral-600/90 dark:bg-black relative"
            initial={{
              y: 100,
              opacity: 0,
              filter: "blur(10px)",
            }}
            animate={{
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
              transition: {
                delay: 0.4,
                duration: 0.5,
                ease: "easeOut",
              },
            }}
            exit={{
              y: 100,
              opacity: 0,
              filter: "blur(10px)",
              transition: {
                delay: 1.1,
                duration: 0.5,
                ease: "easeInOut",
              },
            }}
          >
            {isChatMode ? (
              <ChatView
                {...chatProps}
                getSelectedModelName={getSelectedModelName}
              />
            ) : (
              <ModelSelectionView {...chatProps} />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PocketCard;
