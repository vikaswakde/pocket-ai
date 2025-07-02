import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { BrainIcon, GlobeIcon } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type ModelFiltersProps = {
  filter: string | null;
  handleFilter: (label: string) => void;
};

const containerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 1.4,
    },
  },
};

const itemVariants = {
  hidden: { y: 300, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeInOut" as const,
      type: "spring" as const,
      stiffness: 100,
      damping: 20,
    },
  },
  exit: {
    y: 300,
    opacity: 0,
    transition: {
      duration: 0.8,
      ease: [0.33, 1, 0.68, 1] as const,
      type: "spring" as const,
      stiffness: 100,
      damping: 8,
    },
  },
};

export const ModelFilters = ({ filter, handleFilter }: ModelFiltersProps) => {
  return (
    <motion.div
      className="mt-4 -mb-5 flex items-center justify-center gap-2 text-xs"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div variants={itemVariants}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "rounded-[32px]",
                filter === "fast" && "bg-primary-foreground",
              )}
              size="sm"
              onClick={() => handleFilter("fast")}
            >
              ⚡
            </Button>
          </TooltipTrigger>
          <TooltipContent className="border border-neutral-300 bg-neutral-200 text-neutral-800">
            <p>Fast</p>
          </TooltipContent>
        </Tooltip>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "rounded-[32px]",
                filter === "web search" && "bg-primary-foreground",
              )}
              size="sm"
              onClick={() => handleFilter("web search")}
            >
              <GlobeIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="border border-neutral-300 bg-neutral-200 text-neutral-800">
            <p>Web Search</p>
          </TooltipContent>
        </Tooltip>
      </motion.div>
      <motion.div variants={itemVariants}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "rounded-[32px]",
                filter === "reasoning" && "bg-primary-foreground",
              )}
              size="sm"
              onClick={() => handleFilter("reasoning")}
            >
              <BrainIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="border border-neutral-300 bg-neutral-200 text-neutral-800">
            <p>has reasoning capabilities</p>
          </TooltipContent>
        </Tooltip>
      </motion.div>
    </motion.div>
  );
};
