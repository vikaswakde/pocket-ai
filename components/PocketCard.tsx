"use client";

import pocketlogo from "@/images/pocket-logo.png";
import { cn } from "@/lib/utils";
import { aiModels } from "@/data/aiModels";
import { Message, useChat } from "@ai-sdk/react";
import { GeistSans } from "geist/font/sans";
import {
  AlertCircleIcon,
  ChevronRightIcon,
  SendIcon,
  XIcon,
} from "lucide-react";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
// Add a type for models to handle both component icons and image icons
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ModelIcon = React.NamedExoticComponent<any> | any;

export type Model = {
  id: string;
  name: string;
  description: string;
  Icon: ModelIcon;
  apiId: string;
  children?: Model[];
};

const listVariants = {
  hidden: {
    opacity: 0,
    scale: 0.98,
    filter: "blur(10px)",
  },
  hover: {
    opacity: 1,
    scale: 1.01,
    filter: "blur(0px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  },
};

// Caret animation variants
const caretVariants = {
  open: {
    rotate: 90,
  },
  closed: {
    rotate: 0,
  },
};

// model parent variants
const modelParentVariants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.2, staggerDirection: -1 },
  },
};

// model children variants
const modelChildrenVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { stiffness: 300, damping: 24 },
  },
  closed: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 },
  },
};

const PocketCard = () => {
  const [open, setOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [expandedModels, setExpandedModels] = useState<string[]>([]);
  const [isChatMode, setIsChatMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Store chat histories for each model
  const [chatHistories, setChatHistories] = useState<Record<string, Message[]>>(
    {}
  );

  // Get the API ID for the selected model
  const getSelectedModelApiId = () => {
    const flatModels: Model[] = [
      ...aiModels,
      ...aiModels.flatMap((m) => m.children || []),
    ];
    const model = flatModels.find((m) => m.id === selectedModel);
    return model?.apiId || "google/gemma-3-12b-it:free";
  };

  // Get the display name for the selected model
  const getSelectedModelName = () => {
    const flatModels: Model[] = [
      ...aiModels,
      ...aiModels.flatMap((m) => m.children || []),
    ];
    const model = flatModels.find((m) => m.id === selectedModel);
    return model?.name || "AI";
  };

  // Initialize useChat hook with our API endpoint
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    stop,
    setMessages,
  } = useChat({
    api: "/api/chat",
    body: {
      model: getSelectedModelApiId(),
    },
    id: selectedModel || "default", // Use selectedModel as the chat ID to maintain separate chats
    initialMessages: selectedModel ? chatHistories[selectedModel] || [] : [],
    onError: (error) => {
      console.error("Chat error:", error);
      setErrorMessage(error.message || "Failed to communicate with AI service");
    },
    onResponse: (response) => {
      // Clear any previous errors when we get a successful response
      setErrorMessage(null);

      if (!response.ok) {
        response
          .json()
          .then((data) => {
            if (response.status === 429) {
              setErrorMessage(
                data.error ||
                  "bro i am api credits poor, if you are enjoying this, please dm me on x.com/vikaswakde42"
              );
              setIsRateLimited(true);
            } else {
              setErrorMessage(
                data.error || `Error ${response.status}: ${response.statusText}`
              );
            }
          })
          .catch(() => {
            if (response.status === 429) {
              setErrorMessage(
                "bro i am api credits poor, if you are enjoying this, please dm me on x.com/vikaswakde42"
              );
              setIsRateLimited(true);
            } else {
              setErrorMessage(
                `Error ${response.status}: ${response.statusText}`
              );
            }
          });
      }
    },
    onFinish: () => {
      // Save chat history for this model when a response finishes
      if (selectedModel) {
        setChatHistories((prev) => ({
          ...prev,
          [getSelectedModelApiId()]: messages,
        }));
      }
    },
  });

  // Handle card click - toggle expansion and selection
  const handleCardClick = (modelId: string) => {
    if (isChatMode) return;

    // If the model has children, toggle its expanded state
    const model = aiModels.find((m) => m.id === modelId);
    if (model?.children?.length) {
      setExpandedModels((prev) =>
        prev.includes(modelId) ? prev.filter((id) => id !== modelId) : [modelId]
      );
    }

    // Set as selected model (only for parent models now)
    if (model?.children?.length) {
      setSelectedModel(selectedModel === modelId ? null : modelId);
    }
  };

  // Handle chat button click for a specific model
  const handleChatWithModel = (modelId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering the parent click handler
    setSelectedModel(modelId);

    // If we're already in chat mode and switching models, restore that model's chat history
    if (chatHistories[getSelectedModelApiId()]) {
      setMessages(chatHistories[getSelectedModelApiId()]);
    } else {
      // If this is a new chat, reset messages
      setMessages([]);
    }

    setIsChatMode(true);
    setErrorMessage(null); // Clear any previous errors
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // Exit chat mode
  const exitChatMode = () => {
    // Save current chat history before exiting
    if (selectedModel) {
      setChatHistories((prev) => ({
        ...prev,
        [getSelectedModelApiId()]: messages,
      }));
    }
    setIsChatMode(false);
    setErrorMessage(null); // Clear any errors when exiting chat mode
  };

  // Add effect to set open to true after component mounts
  useEffect(() => {
    setOpen(true);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          className={cn(
            "w-[28rem] min-h-[42rem] h-[42rem] rounded-[0.82rem]",
            "shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgb(0_0_0/0.1),0_4px_6px_-4px_rgb(0_0_0/0.1)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_10px_15px_-3px_rgb(255_255_255/0.1),0_4px_6px_-4px_rgb(255_255_255/0.1)]",
            "p-6 flex flex-col bg-white dark:bg-black/90 border border-neutral-300 dark:border-neutral-700/90",
            GeistSans.className
          )}
          initial={{
            opacity: 0,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: {
              duration: 1.4,
              ease: "easeOut",
            },
          }}
          exit={{
            opacity: 0,
            scale: 0.9,
            transition: {
              delay: 1.4,
              duration: 0.5,
              ease: "easeInOut",
            },
          }}
        >
          <div className="flex justify-between">
            {!isChatMode && (
              <motion.h2
                className="text-2xl font-semibold text-neutral-700/90 dark:text-neutral-300/90"
                initial={{
                  y: 200,
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
                  }}
                  animate={{
                    y: 0,
                    opacity: 1,
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
                    transition: {
                      delay: 0.4,
                      duration: 1.2,
                      ease: "easeOut",
                      type: "spring",
                      stiffness: 100,
                      damping: 20,
                    },
                  }}
                  className="text-xl font-semibold text-neutral-700/90 dark:text-neutral-300/90 mt-2  border-neutral-300 dark:border-neutral-300/90 rounded-lg px-2 items-center flex max-w-[70%] text-wrap"
                >
                  {getSelectedModelName()}
                </motion.h2>
              )}
            </AnimatePresence>

            <motion.div
              initial={{
                y: 300,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
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
                "shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgb(0_0_0/0.1),0_4px_6px_-4px_rgb(0_0_0/0.1)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_10px_15px_-3px_rgb(255_255_255/0.1),0_4px_6px_-4px_rgb(255_255_255/0.1)]",
                "rounded-[0.82rem] px-3 py-2 opacity-85",
                " dark:border-neutral-500/50 dark:border "
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
                className="overflow-hidden cursor-pointer"
                onClick={() => {
                  if (isChatMode) {
                    exitChatMode();
                  } else {
                    setOpen(false);
                  }
                }}
              >
                <XIcon className="text-neutral-400 h-5 w-5 ml-1 dark:text-neutral-300/90" />
              </motion.button>
            </motion.div>
          </div>

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
            className="flex-1 mt-8 bg-gray-100 rounded-[0.82rem] border border-dashed border-neutral-300 dark:border-neutral-600/90 dark:bg-black/50 relative"
            initial={{
              y: 100,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
              transition: {
                delay: 0.4,
                duration: 0.5,
                ease: "easeOut",
              },
            }}
            exit={{
              y: 100,
              opacity: 0,
              transition: {
                delay: 1.1,
                duration: 0.5,
                ease: "easeInOut",
              },
            }}
          >
            {isChatMode ? (
              <div className="absolute inset-0 h-full w-full bg-white/35 dark:bg-black/35 rounded-[0.82] p-4 flex flex-col">
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
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {message.parts?.map((part, partIndex) => {
                          if (part.type === "text") {
                            return <div key={partIndex}>{part.text}</div>;
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
                      disabled={
                        status !== "ready" || !input.trim() || isRateLimited
                      }
                    >
                      <SendIcon size={16} className="mx-1" />
                    </button>
                  )}
                </form>
              </div>
            ) : (
              <motion.div
                variants={listVariants}
                initial="hidden"
                animate={selectedModel ? "visible" : "hidden"}
                whileHover="hover"
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 18,
                }}
                className="absolute inset-0 h-full w-full bg-white/35 rounded-lg divide-y divide-neutral-200 p-2.5 overflow-y-auto scrollbar-hide dark:bg-black/35 dark:divide-neutral-500/60"
              >
                {aiModels.map((model) => (
                  <div key={model.id}>
                    <div
                      className={cn(
                        "flex gap-4 p-5 m-1 rounded-xl cursor-pointer transition-colors duration-200  hover:border-neutral-300 hover:backdrop-blur-2xl",
                        selectedModel === model.id &&
                          "bg-black/5 dark:bg-white/5"
                      )}
                      onClick={() => handleCardClick(model.id)}
                    >
                      <div className="flex items-center">
                        {model.children && model.children.length > 0 && (
                          <motion.div
                            className="mr-2 text-neutral-500 dark:text-neutral-500/80 h-4 w-4 flex items-center justify-center"
                            initial="closed"
                            animate={
                              expandedModels.includes(model.id)
                                ? "open"
                                : "closed"
                            }
                            variants={caretVariants}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <ChevronRightIcon size={16} />
                          </motion.div>
                        )}
                        <div className="h-12 w-12 flex-shrink-0 bg-gradient-to-br shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgb(0_0_0/0.1),0_4px_6px_-4px_rgb(0_0_0/0.1)] bg-white/10 dark:bg-black/10 rounded-3xl flex items-center justify-center border-white dark:border-white/50 border-2 opacity-75">
                          {typeof model.Icon === "object" &&
                          "src" in model.Icon ? (
                            <Image
                              src={model.Icon}
                              alt={model.name}
                              width={32}
                              height={32}
                            />
                          ) : (
                            <model.Icon size={32} />
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-start">
                        <p className="text-sm font-semibold text-neutral-600/95 dark:text-neutral-300/95">
                          {model.name}
                        </p>
                        <p className="text-neutral-500/75 text-sm mt-1 dark:text-neutral-300/75">
                          {model.description}
                        </p>
                      </div>
                    </div>

                    {/* Child models */}
                    <AnimatePresence>
                      {expandedModels.includes(model.id) && model.children && (
                        <motion.div
                          className="pl-2 border-l border-neutral-200 dark:border-neutral-500/60 ml-8"
                          variants={modelParentVariants}
                          initial="closed"
                          animate="open"
                          exit="closed"
                        >
                          {model.children.map((child: Model) => (
                            <motion.div
                              variants={modelChildrenVariants}
                              key={child.id}
                              className={cn(
                                "flex gap-5 p-4 rounded-[0.82rem] transition-colors duration-200 mb-2 ml-2 hover:border-neutral-700 hover:backdrop-blur-2xl hover:bg-white/20 justify-between",
                                "dark:hover:border-neutral-500/60 dark:hover:bg-gray-900/20"
                              )}
                            >
                              <div className="flex gap-4 items-center group justify-between">
                                <div className="flex gap-4 items-center">
                                  <div className="h-8 w-8 flex-shrink-0 bg-gradient-to-br shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgb(0_0_0/0.1),0_4px_6px_-4px_rgb(0_0_0/0.1)] bg-white/10 dark:bg-black/10 rounded-xl flex items-center justify-center border-white dark:border-white/50 border-2 opacity-75">
                                    {typeof child.Icon === "object" &&
                                    "src" in child.Icon ? (
                                      <Image
                                        src={child.Icon}
                                        alt={child.name}
                                        width={16}
                                        height={16}
                                      />
                                    ) : (
                                      <child.Icon size={16} />
                                    )}
                                  </div>
                                  <div className="flex flex-col items-start flex-1">
                                    <div className="flex justify-between w-full items-center">
                                      <p className="text-xs font-semibold text-neutral-600/95 dark:text-neutral-300/95">
                                        {child.name}
                                      </p>
                                    </div>
                                    <p className="text-neutral-500/75 text-xs mt-0.5 dark:text-neutral-300/75">
                                      {child.description}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  className="flex items-center text-sm text-neutral-500/65  gap-2 group-hover:text-neutral-500/95 transition-colors duration-200 px-2 py-1 rounded-lg bg-white/80 dark:bg-black/80 backdrop-blur-2xl border border-neutral-300/90 dark:border-neutral-500/60 group cursor-pointer "
                                  onClick={(e) =>
                                    handleChatWithModel(child.id, e)
                                  }
                                >
                                  ask{" "}
                                  <span className="rotate-320 transition-transform duration-200 group-hover:-translate-y-1">
                                    &rarr;
                                  </span>
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PocketCard;
