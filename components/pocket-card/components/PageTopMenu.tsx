"use client";
import React from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import { Button } from "@/components/ui/button";
import { RefreshCwIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const PageTopMenu = () => {
  const router = useRouter();
  return (
    <div className="absolute top-0 right-0 p-4">
      <div className="flex items-center gap-5">
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={() => router.refresh()}
        >
          <RefreshCwIcon />
        </Button>
        <ModeToggle />
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
    </div>
  );
};

export default PageTopMenu;
