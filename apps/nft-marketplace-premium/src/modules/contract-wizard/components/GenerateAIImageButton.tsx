import { Alert, Box, CircularProgress, useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import { FormattedMessage } from 'react-intl';
import { useAccountHoldDexkitQuery } from 'src/hooks/account';
import { useCreateAIImageMutation } from '../hooks';

interface Props {
  description?: string | null;
  onImageUrl?: (url: string) => void;
}

export function GenerateAIImageButton({ description, onImageUrl }: Props) {
  const theme = useTheme();
  const generateImageMutation = useCreateAIImageMutation();
  const isHoldingKitQuery = useAccountHoldDexkitQuery();

  const handleCreateImage = async () => {
    generateImageMutation.reset();
    if (description && onImageUrl) {
      const imageUrl = await generateImageMutation.mutateAsync({ description });
      if (imageUrl) {
        onImageUrl(imageUrl);
      }
    }
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={
          generateImageMutation.isLoading && (
            <CircularProgress size={theme.spacing(3)} />
          )
        }
        disabled={
          !description ||
          generateImageMutation.isLoading ||
          isHoldingKitQuery.isLoading ||
          isHoldingKitQuery.data === false
        }
        onClick={handleCreateImage}
      >
        {' '}
        {generateImageMutation.isLoading ? (
          <FormattedMessage
            id={'generating.image'}
            defaultMessage={'Generating Image...'}
          />
        ) : (
          <FormattedMessage
            id={'create.image'}
            defaultMessage={'Generate AI Image'}
          />
        )}
      </Button>
      {generateImageMutation.isError && (
        <Box p={2}>
          <Alert severity="error">
            {(generateImageMutation.error as any)?.response?.data?.message ? (
              (generateImageMutation.error as any)?.response?.data?.message
            ) : (
              <FormattedMessage
                id={'error.generating.image'}
                defaultMessage={'Error generating image'}
              />
            )}
          </Alert>
        </Box>
      )}
    </>
  );
}
