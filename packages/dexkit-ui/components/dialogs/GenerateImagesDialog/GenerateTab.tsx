import { useImageGenerate } from "../../../hooks/ai";

import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { ChangeEvent, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import ImageGrid from "./ImageGrid";

export interface GenerateTabProps {
  onSelectForVariant: (imageUrl: string) => void;
  onOpenMenu: (url: string, anchorEl: HTMLElement | null) => void;
  onSelect: (url: string) => void;
  selected: { [key: string]: boolean };
  selectedImages: string[];
  selectable?: boolean;
  isSavingImages?: boolean;
  disabled?: boolean;
}

export default function GenerateTab({
  onSelectForVariant,
  selected,
  onSelect,
  selectable,
  onOpenMenu,
  isSavingImages,
  selectedImages,
  disabled,
}: GenerateTabProps) {
  const {
    mutateAsync: generate,
    data,
    isLoading: isImagesLoading,
  } = useImageGenerate();

  const [prompt, setPrompt] = useState("");
  const [amount, setAmount] = useState("1");

  const handelGenerate = async () => {
    let result = await generate({
      numImages: parseInt(amount),
      prompt,
      size: "512x512",
    });

    if (result?.length === 1) {
      const url = result[0];
      onSelect(url);
    }
  };

  const handleChangePrompt = (e: ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handleChangeAmount = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const { formatMessage } = useIntl();

  const isValid = useMemo(() => {
    const numAmount = parseInt(amount);

    if (numAmount <= 0 || numAmount > 10) {
      return false;
    }

    if (prompt.length > 300 || prompt.length === 0) {
      return false;
    }

    return true;
  }, [amount, prompt]);

  const gridSize = useMemo(() => {
    if (data) {
      if (data.length === 1) {
        return 6;
      } else if (data.length === 2) {
        return 6;
      }
    }

    return 4;
  }, [data]);

  return (
    <>
      <Stack spacing={2}>
        {data ? (
          <ImageGrid
            onOpenMenu={onOpenMenu}
            amount={parseInt(amount)}
            selected={selected}
            selectable={selectable}
            onSelect={onSelect}
            gridSize={gridSize}
            images={data}
            isLoading={isImagesLoading}
          />
        ) : undefined}

        <TextField
          placeholder={formatMessage({
            id: "ex.an.image.of.a.cat",
            defaultMessage: "ex. An image of a cat",
          })}
          onChange={handleChangePrompt}
          value={prompt}
          fullWidth
          rows={6}
          multiline
          disabled={isImagesLoading || disabled}
        />
        <TextField
          label={formatMessage({
            id: "num.of.images",
            defaultMessage: "Num. of Images",
          })}
          disabled={isImagesLoading || disabled}
          onChange={handleChangeAmount}
          value={amount}
          fullWidth
          type="number"
        />
        <Button
          disabled={!isValid || isImagesLoading || disabled}
          onClick={handelGenerate}
          variant="outlined"
          startIcon={
            isImagesLoading ? (
              <CircularProgress size="1rem" color="inherit" />
            ) : undefined
          }
        >
          {isImagesLoading ? (
            <FormattedMessage id="generating" defaultMessage="Generating" />
          ) : (
            <FormattedMessage id="generate" defaultMessage="Generate" />
          )}
        </Button>
      </Stack>
    </>
  );
}
