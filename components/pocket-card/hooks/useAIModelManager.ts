"use client";

import { aiModels } from "@/data/aiModels";
import { useMemo, useState } from "react";

export const useAIModelManager = () => {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [expandedModels, setExpandedModels] = useState<string[]>([]);

  const flatModels = useMemo(
    () => [...aiModels, ...aiModels.flatMap((m) => m.children || [])],
    [],
  );

  const selectedModelInfo = useMemo(
    () => flatModels.find((m) => m.id === selectedModel),
    [flatModels, selectedModel],
  );

  const getSelectedModelApiId = () => {
    return selectedModelInfo?.apiId || "google/gemma-2-12b-it:free";
  };

  const getSelectedModelName = () => {
    return selectedModelInfo?.name || "AI";
  };

  const handleCardClick = (modelId: string) => {
    const model = aiModels.find((m) => m.id === modelId);
    if (model?.children?.length) {
      setExpandedModels((prev) =>
        prev.includes(modelId)
          ? prev.filter((id) => id !== modelId)
          : [modelId],
      );
    }

    if (model?.children?.length) {
      setSelectedModel(selectedModel === modelId ? null : modelId);
    }
  };

  return {
    selectedModel,
    setSelectedModel,
    expandedModels,
    flatModels,
    getSelectedModelApiId,
    getSelectedModelName,
    handleCardClick,
  };
};
