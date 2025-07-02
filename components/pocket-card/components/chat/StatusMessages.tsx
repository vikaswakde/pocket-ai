"use client";

import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { AlertCircleIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

type StatusMessagesProps = {
  status: string;
  errorMessage: string | null;
  getSelectedModelName: () => string;
  showSignInButton?: boolean;
};

export const StatusMessages = ({
  status,
  errorMessage,
  getSelectedModelName,
  showSignInButton,
}: StatusMessagesProps) => {
  return (
    <AnimatePresence>
      {status === "streaming" ||
        (status === "submitted" && (
          <motion.div
            className="ml-2 inline-block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative">
              <span className="animate-pulse bg-gradient-to-r from-gray-500 to-gray-500 bg-clip-text text-sm text-transparent dark:from-white/50 dark:to-white/50">
                {getSelectedModelName()} is thinking...
              </span>
            </div>
          </motion.div>
        ))}

      {errorMessage && (
        <motion.div
          className="mb-4 flex items-center gap-2 rounded-[0.82rem] bg-red-100 p-3 text-red-800 dark:bg-red-900/50 dark:text-red-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AlertCircleIcon size={16} />
          <span className="text-sm">{errorMessage}</span>
        </motion.div>
      )}

      {showSignInButton && (
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <SignInButton mode="modal">
            <Button variant="outline" className="rounded-[32px]">
              Sign In to Continue
            </Button>
          </SignInButton>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
