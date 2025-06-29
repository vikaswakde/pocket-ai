import {
  DeepSeek,
  Gemini,
  Meta,
  Microsoft,
  Mistral,
  Perplexity,
  Qwen,
} from "@lobehub/icons";
import Sarvam from "@/images/sarvam-ai-logo.png";
import { Model } from "@/components/pocket-card/types";

// Updated model structure with nested children
export const aiModels: Model[] = [
  {
    id: "gemini",
    name: "Google Gemini",
    description: "A collection of top gemini models",
    Icon: Gemini.Avatar,
    apiId: "google/gemini-2.0-flash-exp:free",
    children: [
      {
        id: "gemini-2.0-flash-exp",
        name: "Gemini 2.0 Flash Exp",
        description: "Fast, efficient text generation",
        Icon: Gemini.Avatar,
        apiId: "google/gemini-2.0-flash-exp:free",
      },
      {
        id: "gemma-3-12b-it",
        name: "Gemma 3.12b IT",
        description: "Fast, efficient text generation",
        Icon: Gemini.Avatar,
        apiId: "google/gemma-3-12b-it:free",
      },
    ],
  },
  {
    id: "deepseek/deepseek-r1-0528-qwen3-8b:free",
    name: "DeepSeek",
    description: "A collection of top DeepSeek models",
    Icon: DeepSeek.Avatar,
    apiId: "deepseek/deepseek-r1-0528-qwen3-8b:free",
    children: [
      {
        id: "deepseek-r1-0528-qwen3-8b",
        name: "DeepSeek R1",
        description: "Advanced reasoning capabilities",
        Icon: DeepSeek.Avatar,
        apiId: "deepseek/deepseek-r1-0528-qwen3-8b:free",
      },
      {
        id: "qwen-32b",
        name: "Qwen 32b",
        description: "Fast and efficient text generation",
        Icon: Qwen.Avatar,
        apiId: "qwen/qwq-32b:free",
      },
    ],
  },
  {
    id: "mistralai/mistral-small-3.2-24b-instruct-2506:free",
    name: "Mistral",
    description: "A collection of top Mistral models",
    Icon: Mistral.Avatar,
    apiId: "mistralai/mistral-small-3.2-24b-instruct-2506:free",
    children: [
      {
        id: "mistral-small-3.2-24b-instruct-2506",
        name: "Mistral Small 3.2",
        description: "Advanced reasoning capabilities",
        Icon: Mistral.Avatar,
        apiId: "mistralai/mistral-small-3.2-24b-instruct-2506:free",
      },
      {
        id: "mistral-nemo",
        name: "Mistral Nemo",
        description: "Fast and efficient text generation",
        Icon: Mistral.Avatar,
        apiId: "mistralai/mistral-nemo:free",
      },
    ],
  },
  {
    id: "meta-llama/llama-4-maverick-17b-128e-instruct:free",
    name: "Meta",
    description: "A collection of top Meta models",
    Icon: Meta.Avatar,
    apiId: "meta-llama/llama-4-maverick-17b-128e-instruct:free",
    children: [
      {
        id: "llama-4-maverick-17b-128e-instruct",
        name: "Llama 4 Maverick",
        description: "Advanced reasoning capabilities",
        Icon: Meta.Avatar,
        apiId: "meta-llama/llama-4-maverick-17b-128e-instruct:free",
      },
      {
        id: "llama-4-scout-17b-16e-instruct",
        name: "Llama 4 Scout",
        description: "Fast and efficient text generation",
        Icon: Meta.Avatar,
        apiId: "meta-llama/llama-4-scout-17b-16e-instruct:free",
      },
    ],
  },
  {
    id: "sarvamai/sarvam-m:free",
    name: "Sarvam",
    description: "A collection of top Sarvam models",
    Icon: Sarvam,
    apiId: "sarvamai/sarvam-m:free",
    children: [
      {
        id: "sarvam-m",
        name: "Sarvam M",
        description: "Advanced reasoning capabilities",
        Icon: Sarvam,
        apiId: "sarvamai/sarvam-m:free",
      },
    ],
  },
  {
    id: "microsoft/mai-ds-r1:free",
    name: "Microsoft",
    description: "A collection of top Microsoft models",
    Icon: Microsoft.Avatar,
    apiId: "microsoft/mai-ds-r1:free",
    children: [
      {
        id: "mai-ds-r1",
        name: "Mai DS R1",
        description: "Advanced reasoning capabilities",
        Icon: Microsoft.Avatar,
        apiId: "microsoft/mai-ds-r1:free",
      },
    ],
  },
  {
    id: "sonar",
    name: "Perplexity",
    description: "A collection of top Perplexity models",
    Icon: Perplexity.Avatar,
    apiId: "sonar",
    children: [
      {
        id: "sonar",
        name: "Sonar",
        description: "Fast, efficient web search",
        Icon: Perplexity.Avatar,
        apiId: "sonar",
      },
      {
        id: "sonar-pro",
        name: "Sonar Pro",
        description: "Advanced and efficient web search",
        Icon: Perplexity.Avatar,
        apiId: "sonar-pro",
      },
    ],
  },
];
