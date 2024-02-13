import { useImageGenerate, useSaveImages } from "../../../hooks/ai";

import {
  Button,
  CircularProgress,
  Menu,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import ImageGrid from "./ImageGrid";

export interface GenerateTabProps {
  onSelectForVariant: (imageUrl: string) => void;
}

export default function GenerateTab({ onSelectForVariant }: GenerateTabProps) {
  const {
    mutateAsync: generate,
    data,
    isLoading: isImagesLoading,
  } = useImageGenerate();

  const { isLoading: isSavingImages, mutateAsync: saveImages } =
    useSaveImages();

  const [prompt, setPrompt] = useState("");
  const [amount, setAmount] = useState("1");

  const [selected, setSelected] = useState<{ [key: string]: boolean }>({});

  const handelGenerate = async () => {
    let result = await generate({
      numImages: parseInt(amount),
      prompt,
      size: "512x512",
    });

    if (result?.length === 1) {
      const url = result[0];
      setSelected({ [url]: true });
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

  const selectedImages: string[] = useMemo(() => {
    return Object.keys(selected)
      .map((key) => (selected[key] ? key : undefined))
      .filter((r) => r !== undefined) as string[];
  }, [selected]);

  const handleSelect = useCallback((img: string) => {
    setSelected((selected) => {
      const newSelected = { ...selected };

      if (newSelected[img]) {
        newSelected[img] = false;

        const selectedImages = Object.keys(newSelected)
          .map((key) => (newSelected[key] ? key : undefined))
          .filter((r) => r !== undefined) as string[];

        if (selectedImages.length === 0) {
          setSelectable(false);
        }
      } else {
        newSelected[img] = true;
      }

      return newSelected;
    });
  }, []);

  const handleConfirm = async () => {
    await saveImages({ urls: selectedImages });
  };

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

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const [selectable, setSelectable] = useState(false);

  const [selectedUrl, setSelectedUrl] = useState<string>();

  const handleOpenMenu = useCallback(
    (url: string, anchorEl: HTMLElement | null) => {
      setAnchorEl(anchorEl);
      setSelectedUrl(url);
    },
    []
  );

  const handleCloseMenu = () => {
    setSelectedUrl(undefined);
    setAnchorEl(null);
  };

  const handleMenuSelect = () => {
    setSelectable(true);
    handleCloseMenu();
    if (selectedUrl) {
      handleSelect(selectedUrl);
    }
    setSelectedUrl(undefined);
  };

  const handleMenuVariant = () => {
    if (selectedUrl) {
      onSelectForVariant(selectedUrl);
    }
    handleCloseMenu();
  };

  return (
    <>
      <Menu
        onClose={handleCloseMenu}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
      >
        <MenuItem onClick={handleMenuSelect}>
          <FormattedMessage id="select" defaultMessage="Select" />
        </MenuItem>
        <MenuItem onClick={handleMenuVariant}>
          <FormattedMessage
            id="generate.variant"
            defaultMessage="Generate variant"
          />
        </MenuItem>
      </Menu>
      <Stack spacing={2}>
        {data ? (
          <ImageGrid
            onOpenMenu={handleOpenMenu}
            amount={parseInt(amount)}
            selected={selected}
            selectable={selectable}
            onSelect={handleSelect}
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
          disabled={isImagesLoading}
        />
        <TextField
          label={formatMessage({
            id: "num.of.images",
            defaultMessage: "Num. of Images",
          })}
          disabled={isImagesLoading}
          onChange={handleChangeAmount}
          value={amount}
          fullWidth
          type="number"
        />
        <Button
          disabled={!isValid || isImagesLoading}
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
        <Button
          disabled={
            !isValid ||
            isSavingImages ||
            isImagesLoading ||
            selectedImages.length === 0
          }
          onClick={handelGenerate}
          variant="contained"
          startIcon={
            isSavingImages ? (
              <CircularProgress size="1rem" color="inherit" />
            ) : undefined
          }
        >
          {isImagesLoading ? (
            <FormattedMessage id="saving" defaultMessage="Saving" />
          ) : (
            <FormattedMessage id="save" defaultMessage="Save" />
          )}
        </Button>
      </Stack>
    </>
  );
}
