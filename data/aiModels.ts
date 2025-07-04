import { Model } from "@/components/pocket-card/types";
import Sarvam from "@/images/sarvam-ai-logo.png";
import {
  DeepSeek,
  Gemini,
  Meta,
  Microsoft,
  Mistral,
  Perplexity,
  Qwen,
} from "@lobehub/icons";

// Updated model structure with nested children
export const aiModels: Model[] = [
  // {
  //   id: "meta-llama/llama-4-maverick-17b-128e-instruct:free",
  //   name: "Meta",
  //   description: "Multimodal models with text and vision capabilities.",
  //   Icon: Meta.Avatar,
  //   apiId: "meta-llama/llama-4-maverick-17b-128e-instruct:free",
  //   children: [
  //     {
  //       id: "llama-4-maverick-17b-128e-instruct",
  //       name: "Llama 4 Maverick",
  //       description: "High-performance MoE model with 128 experts.",
  //       Icon: Meta.Avatar,
  //       apiId: "meta-llama/llama-4-maverick-17b-128e-instruct:free",
  //       labels: ["vision", "reasoning"],
  //     },
  //     {
  //       id: "llama-4-scout-17b-16e-instruct",
  //       name: "Llama 4 Scout",
  //       description: "Efficient MoE model with 10M token context.",
  //       Icon: Meta.Avatar,
  //       apiId: "meta-llama/llama-4-scout-17b-16e-instruct:free",
  //       labels: ["vision", "reasoning"],
  //     },
  //   ],
  // },
  {
    id: "deepseek/deepseek-r1-0528-qwen3-8b:free",
    name: "DeepSeek",
    description: "Specialized models for reasoning and multimodality.",
    Icon: DeepSeek.Avatar,
    apiId: "deepseek/deepseek-r1-0528-qwen3-8b:free",
    children: [
      {
        id: "deepseek-r1-0528-qwen3-8b",
        name: "DeepSeek R1",
        description: "671B parameter MoE model for advanced reasoning.",
        Icon: DeepSeek.Avatar,
        apiId: "deepseek/deepseek-r1-0528-qwen3-8b:free",
        labels: ["reasoning"],
      },
    ],
  },
  {
    id: "mistralai/mistral-small-3.2-24b-instruct-2506:free",
    name: "Mistral",
    description: "Open models with superior instruction following.",
    Icon: Mistral.Avatar,
    apiId: "mistralai/mistral-small-3.2-24b-instruct-2506:free",
    children: [
      {
        id: "mistral-small-3.2-24b-instruct-2506",
        name: "Mistral Small 3.2",
        description: "Latest model with 128k token context window.",
        Icon: Mistral.Avatar,
        apiId: "mistralai/mistral-small-3.2-24b-instruct-2506:free",
        labels: ["PDF's", "vision"],
      },
      {
        id: "mistral-nemo",
        name: "Mistral Nemo",
        description: "Specialized for function calling and reduced errors.",
        Icon: Mistral.Avatar,
        apiId: "mistralai/mistral-nemo:free",
        labels: ["reasoning", "fast"],
      },
    ],
  },

  {
    id: "qwen/qwq-32b:free",
    name: "Qwen",
    description:
      "MoE architecture to excel in reasoning, multilingual,and agent tasks",
    Icon: Qwen.Avatar,
    apiId: "qwen/qwq-32b:free",
    labels: ["reasoning", "fast"],
    children: [
      {
        id: "qwen/qwq-32b:free",
        name: "Qwen 32B",
        description: "Strong performance in reasoning and code generation.",
        Icon: Qwen.Avatar,
        apiId: "qwen/qwq-32b:free",
        labels: ["reasoning", "fast"],
      },
      {
        id: "qwen3-30b-a3b",
        name: "Qwen3 30B",
        description: "Advanced model with strong multilingual capabilities.",
        Icon: Qwen.Avatar,
        apiId: "qwen/qwen3-30b-a3b:free",
        labels: ["reasoning", "multilingual", "fast"],
      },
      {
        id: "qwen2.5-vl-32b-instruct",
        name: "Qwen 2.5 VL",
        description:
          "Vision-language model with strong multimodal capabilities.",
        Icon: Qwen.Avatar,
        apiId: "qwen/qwen2.5-vl-32b-instruct:free",
        labels: ["vision", "reasoning"],
      },
    ],
  },
  {
    id: "sonar",
    name: "Perplexity",
    description: "Real-time web search and grounded reasoning.",
    Icon: Perplexity.Avatar,
    apiId: "sonar",
    children: [
      {
        id: "sonar",
        name: "Sonar",
        description: "Lightweight, fast, and affordable web search.",
        Icon: Perplexity.Avatar,
        apiId: "sonar",
        labels: ["web search", "fast"],
      },
      {
        id: "sonar-pro",
        name: "Sonar Pro",
        description: "Advanced search with a larger context window.",
        Icon: Perplexity.Avatar,
        apiId: "sonar-pro",
        labels: ["web search", "PDF's"],
      },
    ],
  },
  {
    id: "gemini",
    name: "Google Gemini",
    description: "Advanced, multimodal models for complex reasoning.",
    Icon: Gemini.Avatar,
    apiId: "google/gemini-2.0-flash-exp:free",
    children: [
      {
        id: "gemini-2.0-flash-exp",
        name: "Gemini 2.0 Flash Exp",
        description:
          "Fast, efficient model with enhanced context understanding.",
        Icon: Gemini.Avatar,
        apiId: "google/gemini-2.0-flash-exp:free",
        labels: ["vision", "reasoning", "fast"],
      },
      {
        id: "gemma-3-12b-it",
        name: "Gemma 3.12b IT",
        description: "Lightweight and cost-effective for high performance.",
        Icon: Gemini.Avatar,
        apiId: "google/gemma-3-12b-it:free",
        labels: ["reasoning", "fast"],
      },
      {
        id: "gemma-3-27b-it",
        name: "Gemma 3.27b IT",
        description: "Larger model with enhanced reasoning capabilities.",
        Icon: Gemini.Avatar,
        apiId: "google/gemma-3-27b-it:free",
        labels: ["reasoning", "vision", "fast"],
      },
    ],
  },

  {
    id: "sarvamai/sarvam-m:free",
    name: "Sarvam",
    description: "Models excelling in Indian languages and reasoning.",
    Icon: Sarvam,
    apiId: "sarvamai/sarvam-m:free",
    children: [
      {
        id: "sarvam-m",
        name: "Sarvam M",
        description: "24B parameter model for Indian languages and math.",
        Icon: Sarvam,
        apiId: "sarvamai/sarvam-m:free",
        labels: ["reasoning"],
      },
    ],
  },
  {
    id: "microsoft/mai-ds-r1:free",
    name: "Microsoft",
    description: "Enhanced models with improved safety and reasoning.",
    Icon: Microsoft.Avatar,
    apiId: "microsoft/mai-ds-r1:free",
    children: [
      {
        id: "mai-ds-r1",
        name: "Mai DS R1",
        description: "Fine-tuned for safety with 99.3% response rate.",
        Icon: Microsoft.Avatar,
        apiId: "microsoft/mai-ds-r1:free",
        labels: ["vision", "PDF's", "reasoning"],
      },
    ],
  },
];
