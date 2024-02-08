import { useImageGenerate } from '@/modules/user/hooks/ai';
import { AppDialogTitle } from '@dexkit/ui';
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
} from '@mui/material';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import ImageButton from './ImageButton';

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

  const [prompt, setPrompt] = useState('');
  const [amount, setAmount] = useState('1');

  const [selected, setSelected] = useState<{ [key: string]: boolean }>({});

  const handelGenerate = async () => {
    await generate({ numImages: parseInt(amount), prompt, size: '512x512' });
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
      onClose({}, 'backdropClick');
    }
  };

  const handleConfirm = () => {};

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
              <Grid spacing={2} container>
                {data.map((img: string, index: number) => (
                  <Grid key={index} item xs={12} sm={4}>
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
              <Grid spacing={2} container>
                {new Array(parseInt(amount))
                  .fill(null)
                  .map((img: string, index: number) => (
                    <Grid key={index} item xs={12} sm={4}>
                      <Skeleton
                        variant="rectangular"
                        sx={{ aspectRatio: '1/1', width: '100%' }}
                      />
                    </Grid>
                  ))}
              </Grid>
            </Box>
          )}

          <TextField
            placeholder={formatMessage({
              id: 'ex.an.image.of.a.cat',
              defaultMessage: 'ex. An image of a cat',
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
              id: 'num.of.images',
              defaultMessage: 'Num. of Images',
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
          disabled={selectedImages.length === 0}
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
