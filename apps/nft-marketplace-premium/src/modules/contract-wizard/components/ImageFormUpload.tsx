import { Box, Button, Stack, styled } from '@mui/material';
import { useState } from 'react';
import MediaDialog from 'src/components/mediaDialog';
import ImageIcon from '@mui/icons-material/Image';

const CustomImage = styled('img')(({ theme, height, width }) => ({
  height: theme.spacing(Number(height || 20)),
  width: theme.spacing(Number(width || 20)),
}));

const CustomImageIcon = styled(ImageIcon)(({ theme, height, width }) => ({
  height: theme.spacing(Number(height || 20)),
  width: theme.spacing(Number(width || 20)),
}));

interface Props {
  onSelectFile: (file: string) => void;
  error: boolean;
  value: string | null;
  imageHeight?: number;
  imageWidth?: number;
}

export function ImageFormUpload(props: Props) {
  const { onSelectFile, error, value, imageHeight, imageWidth } = props;
  const [openMediaDialog, setOpenMediaDialog] = useState(false);

  return (
    <>
      <MediaDialog
        dialogProps={{
          open: openMediaDialog,
          maxWidth: 'lg',
          fullWidth: true,
          onClose: () => {
            setOpenMediaDialog(false);
          },
        }}
        onConfirmSelectFile={(file) => {
          if (file) {
            onSelectFile(file.url);
          }

          setOpenMediaDialog(false);
        }}
      />
      <Box>
        <Stack direction="row" justifyContent="center">
          <Button
            onClick={() => {
              setOpenMediaDialog(true);
            }}
            sx={
              error
                ? {
                    border: (theme) => `1px solid ${theme.palette.error.main}`,
                  }
                : undefined
            }
          >
            {value ? (
              <CustomImage
                alt=""
                src={value as string}
                height={imageHeight}
                width={imageWidth}
              />
            ) : (
              <CustomImageIcon height={imageHeight} width={imageWidth} />
            )}
          </Button>
        </Stack>
      </Box>
    </>
  );
}
