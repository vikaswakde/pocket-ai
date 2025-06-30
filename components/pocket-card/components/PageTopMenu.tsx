"use client";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import { RefreshCwIcon } from "lucide-react";

const PageTopMenu = () => {
  const pageReload = () => {
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
            <RefreshCwIcon />
          </Button>
          <ModeToggle />
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
