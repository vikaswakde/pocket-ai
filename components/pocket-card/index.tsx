"use client";

import { cn } from "@/lib/utils";
import { GeistSans } from "geist/font/sans";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { usePocket } from "./hooks/usePocket";
import { CardHeader } from "./components/CardHeader";
import { ChatView } from "./components/ChatView";
import { ModelSelectionView } from "./components/ModelSelectionView";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const PocketCard = () => {
  const {
    open,
    setOpen,
    isChatMode,
    getSelectedModelName,
    exitChatMode,
    ...chatProps
  } = usePocket();

  const router = useRouter()
  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          className={cn(
            "h-[45rem] min-h-[45rem] w-[25rem] rounded-[40px] md:h-[48rem] md:min-h-[48rem] md:w-[30rem]",
            "shadow-[0_31px_31.3px_0px_rgba(0,0,0,0.09)]",
            "flex flex-col border border-neutral-300 bg-white px-[10px] pb-[10px] dark:border-neutral-700/90 dark:bg-[#292727]",
            GeistSans.className,
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
              className="-mt-3.5 max-w-[52%] px-4 text-[15px] leading-5 text-wrap text-neutral-600/70 dark:text-neutral-300/70"
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
            className="relative mt-8 flex-1 rounded-[32px] border border-neutral-300 bg-[#F5F5F5] shadow-[0_8px_25px_rgb(0,0,0,0.12)] dark:border-[2px] dark:border-neutral-600/90 dark:bg-[#161616]"
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
