"use client";

import { useConvexAuth } from "convex/react";
import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const ANONYMOUS_USER_ID_KEY = "pocket-ai-anonymous-user-id";

export const useUserSession = () => {
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
  const [anonymousId, setAnonymousId] = useState<string | null>(null);
  const migrateAnonymousChats = useMutation(api.chats.migrateAnonymousChats);

  // Anonymous user management
  useEffect(() => {
    if (typeof window !== "undefined" && !isAuthLoading && !isAuthenticated) {
      let anonId = localStorage.getItem(ANONYMOUS_USER_ID_KEY);
      if (!anonId) {
        anonId = crypto.randomUUID();
        localStorage.setItem(ANONYMOUS_USER_ID_KEY, anonId);
      }
      setAnonymousId(anonId);
    }
  }, [isAuthenticated, isAuthLoading]);

  // Chat migration
  useEffect(() => {
    if (typeof window !== "undefined") {
      const anonId = localStorage.getItem(ANONYMOUS_USER_ID_KEY);
      if (isAuthenticated && anonId) {
        migrateAnonymousChats({ anonymousId: anonId }).then(() => {
          localStorage.removeItem(ANONYMOUS_USER_ID_KEY);
          setAnonymousId(null);
        });
      }
    }
  }, [isAuthenticated, migrateAnonymousChats]);

  return { isAuthenticated, isAuthLoading, anonymousId };
};
