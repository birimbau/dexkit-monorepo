import { useImageGenerate, useSaveImages } from "../../../hooks/ai";

import { AppDialogTitle } from "@dexkit/ui";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Grid,
  Skeleton,
  Stack,
  TextField,
} from "@mui/material";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import ImageButton from "./ImageButton";

export interface GenerateImagesDialogProps {
  DialogProps: DialogProps;
}

export default function GenerateImagesDialog({
  DialogProps,
}: GenerateImagesDialogProps) {
  const { onClose } = DialogProps;

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
      } else {
        newSelected[img] = true;
      }

      return newSelected;
    });
  }, []);

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

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

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="ai.image.generator"
            defaultMessage="AI Image Generator"
          />
        }
        onClose={handleClose}
      />
      <DialogContent dividers>
        <Stack spacing={2}>
          {data ? (
            <Box>
              <Grid spacing={2} container justifyContent="center">
                {data.map((img: string, index: number) => (
                  <Grid key={index} item xs={12} sm={gridSize}>
                    <ImageButton
                      src={img}
                      selected={selected[img]}
                      onSelect={handleSelect}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : undefined}
          {isImagesLoading && (
            <Box>
              <Grid spacing={2} container justifyContent="center">
                {new Array(parseInt(amount))
                  .fill(null)
                  .map((img: string, index: number) => (
                    <Grid key={index} item xs={12} sm={gridSize}>
                      <Skeleton
                        variant="rectangular"
                        sx={{
                          aspectRatio: "1/1",
                          width: "100%",
                          minHeight: (theme) => theme.spacing(20),
                        }}
                      />
                    </Grid>
                  ))}
              </Grid>
            </Box>
          )}

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
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={isSavingImages || selectedImages.length === 0}
          startIcon={
            isSavingImages ? (
              <CircularProgress size="1rem" color="inherit" />
            ) : undefined
          }
          variant="contained"
          onClick={handleConfirm}
        >
          <FormattedMessage id="save.images" defaultMessage="Save Images" />
        </Button>
        <Button onClick={handleClose}>
          <FormattedMessage id="cancel" defaultMessage="cancel" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
