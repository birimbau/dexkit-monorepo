import AutoAwesome from "@mui/icons-material/AutoAwesome";
import { IconButton, InputAdornment, Tooltip } from "@mui/material";
import React, { MouseEvent, useCallback, useRef, useState } from "react";
import CompletationContext from "../context/CompletationContext";

import dynamic from "next/dynamic";
import { FormattedMessage } from "react-intl";
import { TextImproveAction } from "../constants/ai";
import { useCompletation } from "../hooks/ai";

const CompletationPopover = dynamic(() => import("./CompletationPopover"), {
  ssr: false,
});

export interface CompletationProviderProps {
  children: ({}: {
    ref: React.MutableRefObject<HTMLElement | null>;
    inputAdornment: (position: "start" | "end") => React.ReactNode;
    open: () => void;
  }) => React.ReactNode;
  onCompletation: (output: string) => void;
  initialPrompt?: string;
  multiline?: boolean;
}

export default function CompletationProvider({
  children,
  onCompletation,
  initialPrompt,
  multiline,
}: CompletationProviderProps) {
  const [showAiComp, setShowAiComp] = useState(false);
  const ref = useRef<HTMLInputElement | null>(null);
  const completationMutation = useCompletation();

  const handleOpenComp = (event: MouseEvent<HTMLButtonElement>) => {
    setShowAiComp(true);
  };

  const handleClose = () => {
    setShowAiComp(false);
    completationMutation.reset();
  };

  const handleCompletation = useCallback(async () => {}, []);

  const inputAdornment = useCallback(
    (position: "start" | "end") => {
      return (
        <InputAdornment position={position}>
          <Tooltip
            title={
              <FormattedMessage
                id="ai.completation"
                defaultMessage="AI Completation"
              />
            }
          >
            <IconButton onClick={handleOpenComp}>
              <AutoAwesome />
            </IconButton>
          </Tooltip>
        </InputAdornment>
      );
    },
    [handleOpenComp]
  );

  const getPromptByAction = useCallback(
    (prompt: string, action: TextImproveAction) => {
      switch (action) {
        case TextImproveAction.GENERATE:
          return `Generate a text based for: "${prompt}".`;
        case TextImproveAction.IMPROVE_WRITING:
          return `Improve text writing for: "${prompt}"`;
        case TextImproveAction.IMPROVE_SPELLING:
          return `Improve text spelling and grammar for: "${prompt}"`;
        case TextImproveAction.MAKE_SHORTER:
          return `Make this text shorter: "${prompt}"`;
        case TextImproveAction.MAKE_LONGER:
          return `Make this text longer: "${prompt}"`;
      }
    },
    []
  );

  const handleGenerate = useCallback(
    async (prompt: string, action?: TextImproveAction) => {
      if (action) {
        const actionPrompt = getPromptByAction(prompt, action);

        await completationMutation.mutateAsync({
          messages: [
            {
              role: "user",
              content: "You are an assistant. Do not return text with quotes",
            },
            { role: "user", content: actionPrompt },
          ],
        });
      }
    },
    [getPromptByAction]
  );

  const handleConfirmCompletation = useCallback(async () => {
    if (completationMutation.data) {
      onCompletation(completationMutation.data?.output);
      handleClose();
    }
  }, [onCompletation, completationMutation.data, handleClose]);

  return (
    <CompletationContext.Provider value={{}}>
      {showAiComp && (
        <CompletationPopover
          open={showAiComp}
          onClose={handleClose}
          anchorEl={ref.current}
          onGenerate={handleGenerate}
          output={completationMutation.data?.output}
          onConfirm={handleConfirmCompletation}
          initialPrompt={initialPrompt}
          multiline={multiline}
        />
      )}
      {children({ ref, open: handleCompletation, inputAdornment })}
    </CompletationContext.Provider>
  );
}
