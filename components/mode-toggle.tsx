"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    if (!document.startViewTransition) {
      setTheme(newTheme);
      return;
    }
    document.startViewTransition(() => setTheme(newTheme));
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="cursor-pointer px-[1.3rem] py-[1.3rem]"
    >
      <Sun className="h-[1.3rem] w-[1.3rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-[1.3rem] w-[1.3rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
