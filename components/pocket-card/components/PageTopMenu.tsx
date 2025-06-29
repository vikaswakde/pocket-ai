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
    <div className="absolute top-0 right-0 left-0 p-4">
      <div className="flex items-center justify-between gap-5">
        <div>
          <Authenticated>
            <UserButton />
          </Authenticated>
          <Unauthenticated>
            <SignInButton>
              <Button variant="outline" className="cursor-pointer">
                Sign in
              </Button>
            </SignInButton>
          </Unauthenticated>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={pageReload}
          >
            <RefreshCwIcon />
          </Button>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
};

export default PageTopMenu;
