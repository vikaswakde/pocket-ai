"use client";

import {
  listVariants,
  caretVariants,
  modelParentVariants,
  modelChildrenVariants,
} from "../animations";
import { Model } from "../types";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { ChevronRightIcon } from "lucide-react";
import { aiModels } from "@/data/aiModels";

type ModelSelectionViewProps = {
  selectedModel: string | null;
  handleCardClick: (modelId: string) => void;
  expandedModels: string[];
  handleChatWithModel: (modelId: string, e: React.MouseEvent) => void;
};

export const ModelSelectionView = ({
  selectedModel,
  handleCardClick,
  expandedModels,
  handleChatWithModel,
}: ModelSelectionViewProps) => {
  return (
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
      className="absolute inset-0 h-full w-full bg-white/35  divide-y divide-neutral-200 p-2.5 overflow-y-auto scrollbar-hide dark:bg-[#161616] dark:divide-neutral-500/60 rounded-[32px]"
    >
      {aiModels.map((model) => (
        <div key={model.id}>
          <div
            className={cn(
              "flex gap-4 p-5 m-1 rounded-xl cursor-pointer transition-colors duration-200  hover:border-neutral-300 hover:backdrop-blur-2xl",
              selectedModel === model.id && "bg-black/5 dark:bg-white/5"
            )}
            onClick={() => handleCardClick(model.id)}
          >
            <div className="flex items-center">
              {model.children && model.children.length > 0 && (
                <motion.div
                  className="mr-2 text-neutral-500 dark:text-neutral-500/80 h-4 w-4 flex items-center justify-center"
                  initial="closed"
                  animate={
                    expandedModels.includes(model.id) ? "open" : "closed"
                  }
                  variants={caretVariants}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <ChevronRightIcon size={16} />
                </motion.div>
              )}
              <div className="h-12 w-12 flex-shrink-0 bg-gradient-to-br shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgb(0_0_0/0.1),0_4px_6px_-4px_rgb(0_0_0/0.1)] bg-white/10 dark:bg-black/10 rounded-3xl flex items-center justify-center border-white dark:border-white/50 border-2 opacity-75">
                {typeof model.Icon === "object" && "src" in model.Icon ? (
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
                      "flex gap-5 p-4 rounded-[0.82rem] transition-colors duration-200 mb-2 ml-2 hover:border-neutral-700 hover:backdrop-blur-2xl hover:bg-white/20 justify-between group",
                      "dark:hover:border-neutral-500/60 dark:hover:bg-gray-300/10"
                    )}
                  >
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
                      className="flex items-center text-sm text-neutral-500/65  gap-2 group-hover:text-neutral-500/95 transition-colors duration-200 px-2 py-1 rounded-lg bg-white/80 dark:bg-black/70 backdrop-blur-2xl border border-neutral-300/90 dark:border-neutral-500/60 group cursor-pointer "
                      onClick={(e) => handleChatWithModel(child.id, e)}
                    >
                      ask{" "}
                      <span className="rotate-320 transition-transform duration-200 group-hover:-translate-y-1">
                        &rarr;
                      </span>
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </motion.div>
  );
};
