"use client";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import { motion } from "motion/react";
import { GithubIcon, RefreshCwIcon } from "lucide-react";
import { useState } from "react";

const PageTopMenu = () => {
  const [isReloading, setIsReloading] = useState(false);
  const pageReload = () => {
    setIsReloading(true);
    window.location.reload();
  };

  return (
    <div className="absolute top-0 z-10 mx-auto p-4">
      <div className="flex items-center justify-between gap-5">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="cursor-pointer py-[1.3rem]"
            onClick={pageReload}
          >
            <motion.div
              animate={{ rotate: isReloading ? 360 : 0 }}
              transition={{
                repeat: isReloading ? Infinity : 0,
                ease: "linear",
                duration: 3,
              }}
            >
              <RefreshCwIcon />
            </motion.div>
          </Button>
          <ModeToggle />
          <Button
            variant="outline"
            className="cursor-pointer py-[1.3rem]"
            onClick={() => {
              window.open("https://github.com/vikaswakde/pocket-ai", "_blank");
            }}
          >
            <GithubIcon />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Authenticated>
            <Button
              variant="outline"
              className="-ml-2 cursor-pointer px-[8px] py-[1.3rem]"
            >
              <UserButton />
            </Button>
          </Authenticated>
          <Unauthenticated>
            <div className="">
              <SignInButton mode="modal">
                <Button
                  variant="outline"
                  className="-ml-2 cursor-pointer py-[1.3rem]"
                >
                  Sign in
                </Button>
              </SignInButton>
            </div>
          </Unauthenticated>
        </div>
      </div>
    </div>
  );
};

export default PageTopMenu;
