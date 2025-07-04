"use client";

import { useState } from "react";
import { aiModels } from "@/data/aiModels";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BrainCircuit,
  ChevronRightIcon,
  Code,
  Eye,
  File,
  Languages,
  Layers,
  Mic,
  Search,
  Shield,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import {
  caretVariants,
  listVariants,
  modelChildrenVariants,
  modelParentVariants,
} from "../animations";
import { useIsMobile } from "../hooks/useIsMobile";
import { Model } from "../types";

type ModelSelectionViewProps = {
  selectedModel: string | null;
  handleCardClick: (modelId: string) => void;
  expandedModels: string[];
  handleChatWithModel: (modelId: string, e: React.MouseEvent) => void;
  filter: string | null;
  hasHoveredOnce: boolean;
  setHasHoveredOnce: (value: boolean) => void;
};

export const ModelSelectionView = ({
  selectedModel,
  handleCardClick,
  expandedModels,
  handleChatWithModel,
  filter,
  hasHoveredOnce,
  setHasHoveredOnce,
}: ModelSelectionViewProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const isMobile = useIsMobile();
  const getLabelIcon = (label: string, size: number = 12) => {
    const iconProps = {
      size,
      className: "text-neutral-500 dark:text-neutral-400",
    };
    switch (label.toLowerCase()) {
      case "vision":
        return <Eye {...iconProps} />;
      case "reasoning":
        return <BrainCircuit {...iconProps} />;
      case "code":
        return <Code {...iconProps} />;
      case "multimodal":
        return <Layers {...iconProps} />;
      case "safety":
        return <Shield {...iconProps} />;
      case "web search":
        return <Search {...iconProps} />;
      case "indic languages":
        return <Languages {...iconProps} />;
      case "voice":
        return <Mic {...iconProps} />;
      case "PDF's":
        return <File {...iconProps} />;
      default:
        return null;
    }
  };

  const filteredModels = filter
    ? aiModels.filter((model) => {
        const parentHasLabel = model.labels?.includes(filter);
        const childHasLabel = model.children?.some((child) =>
          child.labels?.includes(filter),
        );
        return parentHasLabel || childHasLabel;
      })
    : aiModels;

  return (
    <>
      <motion.div
        variants={listVariants}
        initial="hidden"
        animate={selectedModel ? "visible" : "hidden"}
        whileHover="hover"
        onHoverStart={() => {
          if (!isMobile) {
            setIsHovering(true);
            setHasHoveredOnce(true);
          }
        }}
        onHoverEnd={() => setIsHovering(false)}
        onTap={() => {
          if (isMobile) {
            setHasHoveredOnce(true);
          }
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 18,
        }}
        className="scrollbar-hide absolute inset-0 h-full w-full divide-y divide-neutral-200 overflow-y-auto rounded-[32px] bg-white/35 p-2.5 dark:divide-neutral-500/60 dark:bg-[#161616]"
      >
        {filteredModels.map((model) => (
          <div key={model.id}>
            <div
              className={cn(
                "m-1 flex cursor-pointer gap-4 rounded-xl p-5 transition-colors duration-200 hover:border-neutral-300 hover:backdrop-blur-2xl",
                selectedModel === model.id && "bg-black/5 dark:bg-white/5",
              )}
              onClick={() => handleCardClick(model.id)}
            >
              <div className="flex items-center">
                {model.children && model.children.length > 0 && (
                  <motion.div
                    className="mr-2 flex h-4 w-4 items-center justify-center text-neutral-500 dark:text-neutral-500/80"
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
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-3xl border-2 border-white bg-white/10 bg-gradient-to-br opacity-75 shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgb(0_0_0/0.1),0_4px_6px_-4px_rgb(0_0_0/0.1)] dark:border-white/50 dark:bg-black/10">
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
              <div className="flex flex-1 flex-col items-start">
                <p className="text-sm font-semibold text-neutral-600/95 dark:text-neutral-300/95">
                  {model.name}
                </p>
                <p className="mt-1 text-sm text-neutral-500/75 dark:text-neutral-300/75">
                  {model.description}
                </p>
              </div>
            </div>

            {/* Child models */}
            <AnimatePresence>
              {expandedModels.includes(model.id) && model.children && (
                <motion.div
                  className="ml-8 border-l border-neutral-200 pl-2 dark:border-neutral-500/60"
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
                        "group mb-2 ml-2 flex justify-between gap-5 rounded-[0.82rem] p-4 transition-colors duration-200 hover:border-neutral-700 hover:bg-white/20 hover:backdrop-blur-2xl",
                        "dark:hover:border-neutral-500/60 dark:hover:bg-gray-300/10",
                      )}
                    >
                      <div className="flex flex-1 items-start gap-4">
                        <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border-2 border-white bg-white/10 bg-gradient-to-br opacity-75 shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgb(0_0_0/0.1),0_4px_6px_-4px_rgb(0_0_0/0.1)] dark:border-white/50 dark:bg-black/10">
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
                        <div className="flex flex-1 flex-col items-start">
                          <div className="flex w-full items-center justify-between">
                            <p className="text-xs font-semibold text-neutral-600/95 dark:text-neutral-300/95">
                              {child.name}
                            </p>
                          </div>
                          <p className="mt-0.5 text-xs text-neutral-500/75 dark:text-neutral-300/75">
                            {child.description}
                          </p>
                          {child.labels && child.labels.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {child.labels.map((label) => (
                                <div
                                  key={label}
                                  className="flex items-center gap-2 rounded-full bg-neutral-200/50 px-2 py-0.5 text-[10px] text-neutral-500 dark:bg-neutral-600/50 dark:text-neutral-400"
                                >
                                  {getLabelIcon(label)}
                                  {label}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        className="cursor-pointer self-center rounded-lg bg-neutral-200/10 px-3 py-1.5 text-sm text-neutral-400 transition-colors duration-200 group-hover:bg-neutral-100 hover:border hover:border-neutral-200 dark:bg-black/10 dark:group-hover:bg-neutral-700 dark:hover:border-neutral-500/60 dark:hover:bg-neutral-800"
                        onClick={(e) => handleChatWithModel(child.id, e)}
                      >
                        <span className="text-xs">ask</span>{" "}
                        <ArrowRight
                          size={12}
                          className="ml-1 inline -rotate-45 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-125"
                        />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </motion.div>
      {!isHovering && !hasHoveredOnce && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="text-sm text-neutral-500">
            {isMobile ? "Click me" : "Hover me"}
          </div>
        </div>
      )}
    </>
  );
};
