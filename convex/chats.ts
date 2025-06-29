import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

export const createChat = mutation({
  args: {
    model: v.string(),
    anonymousId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity) {
      const userId = identity.subject;
      return await ctx.db.insert("chats", {
        userId,
        model: args.model,
      });
    }

    if (args.anonymousId) {
      return await ctx.db.insert("chats", {
        anonymousId: args.anonymousId,
        model: args.model,
      });
    }

    // This should not happen if the client logic is correct
    throw new ConvexError(
      "Either user must be authenticated or anonymousId must be provided.",
    );
  },
});

export const getChatsForUser = query({
  args: {
    anonymousId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity) {
      const userId = identity.subject;
      return await ctx.db
        .query("chats")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect();
    }

    if (args.anonymousId) {
      return await ctx.db
        .query("chats")
        .withIndex("by_anonymous_id", (q) =>
          q.eq("anonymousId", args.anonymousId),
        )
        .collect();
    }

    return [];
  },
});

export const migrateAnonymousChats = mutation({
  args: {
    anonymousId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("User must be authenticated to migrate chats.");
    }
    const userId = identity.subject;

    const chatsToMigrate = await ctx.db
      .query("chats")
      .withIndex("by_anonymous_id", (q) =>
        q.eq("anonymousId", args.anonymousId),
      )
      .collect();

    for (const chat of chatsToMigrate) {
      await ctx.db.patch(chat._id, { userId, anonymousId: undefined });
    }
  },
});
