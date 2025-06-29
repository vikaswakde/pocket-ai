import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  chats: defineTable({
    userId: v.optional(v.string()),
    anonymousId: v.optional(v.string()),
    model: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_anonymous_id", ["anonymousId"]),
  messages: defineTable({
    chatId: v.id("chats"),
    content: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    parts: v.optional(v.array(v.any())),
  }).index("by_chat", ["chatId"]),
});
