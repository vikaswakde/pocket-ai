import { Redis } from "@upstash/redis";
import { NextRequest } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

// LLM providers
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { perplexity } from "@ai-sdk/perplexity";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const redis = Redis.fromEnv();

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  const currUser = await currentUser();

  if (userId) {
    // Check for exception email
    const isExceptionUser =
      currUser?.emailAddresses?.[0]?.emailAddress?.includes(
        "vikaswakdepc@gmail.com",
      );

    // Skip rate limiting for the exception user
    if (!isExceptionUser) {
      // Rate limiting for logged-in users
      const rateLimitKey = `pocket-ai-ratelimit:user:${userId}`;
      const currentUsage = await redis.get(rateLimitKey);

      if (currentUsage && Number(currentUsage) >= 10) {
        return new Response(
          JSON.stringify({
            error:
              "Subscribe to get unlimited access to pocket ai, or try again tomorrow.",
          }),
          { status: 429, headers: { "Content-Type": "application/json" } },
        );
      }
    }
  } else {
    // Rate limiting for anonymous users (IP-based)
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    console.log("this is ip", ip);

    // check if the user's IP is in the allowlist
    const allowlist = (process.env.IP_ALLOWLIST || "")
      .split(",")
      .map((item) => item.trim());

    if (!allowlist.includes(ip)) {
      const rateLimitKey = `pocket-ai-ratelimit:ip:${ip}`;
      const currentUsage = await redis.get(rateLimitKey);

      if (currentUsage && Number(currentUsage) >= 3) {
        return new Response(
          JSON.stringify({ error: "Sign in to increase limits" }),
          { status: 429, headers: { "Content-Type": "application/json" } },
        );
      }
    }
  }

  try {
    const { messages, model } = await req.json();

    const selectedModel = model || "google/gemma-2-12b-it:free";
    const isPerplexity = selectedModel.includes("sonar");
    let modelInstance;

    if (isPerplexity) {
      if (!process.env.PERPLEXITY_API_KEY) {
        return new Response(
          JSON.stringify({ error: "No PERPLEXITY_API_KEY found" }),
          { status: 500, headers: { "content-type": "application/json" } },
        );
      }
      modelInstance = perplexity(selectedModel);
    } else {
      const openrouterApiKey = process.env.OPENROUTER_API_KEY;
      if (!openrouterApiKey) {
        return new Response(
          JSON.stringify({ error: "No OPENROUTER_API_KEY found" }),
          { status: 500, headers: { "content-type": "application/json" } },
        );
      }
      modelInstance = createOpenRouter({
        apiKey: openrouterApiKey,
      }).chat(selectedModel);
    }

    const result = await streamText({
      model: modelInstance,
      messages,
      system:
        "You are a pocket ai, a helpful assistant that can answer questions in very short and concise answers that are human readable, fit in a pocket card, and follow the human writing style, our philosophy is to be helpful and concise, and to the point.",
      providerOptions: {
        perplexity: {
          return_images: true,
          max_tokens: 300,
        },
      },
      onFinish: async () => {
        if (userId) {
          // increment usage for logged-in user
          const rateLimitKey = `pocket-ai-ratelimit:user:${userId}`;
          const newUsage = await redis.incr(rateLimitKey);
          if (newUsage === 1) {
            // Set expiration for 24 hours
            await redis.expire(rateLimitKey, 60 * 60 * 24);
          }
        } else {
          // increment usage for anonymous user
          const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
          const allowlist = (process.env.IP_ALLOWLIST || "")
            .split(",")
            .map((item) => item.trim());

          if (!allowlist.includes(ip)) {
            // increment usage count after successful api call only if not in allowlist
            const rateLimitKey = `pocket-ai-ratelimit:ip:${ip}`;
            const newUsage = await redis.incr(rateLimitKey);

            if (newUsage === 1) {
              // set an expiration for the key if it's the first time
              await redis.expire(rateLimitKey, 60 * 60 * 2); // 2 hours
            }
          }
        }
      },
    });

    return result.toDataStreamResponse({
      sendReasoning: true,
      sendSources: true,
    });
  } catch (error) {
    console.error("Error in pocket ai api", error);
    // return a generic error message
    return new Response(
      JSON.stringify({
        error: "An error occurred while processing your request",
      }),
      {
        status: 500,
        headers: {
          "content-type": "application/json",
        },
      },
    );
  }
}
