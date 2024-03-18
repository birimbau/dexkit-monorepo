import { Container, Stack, styled, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { useState } from 'react';

import MediaDialog from '@dexkit/ui/components/mediaDialog';
import ImageIcon from '@mui/icons-material/Image';
import { FormattedMessage } from 'react-intl';
import { connectField } from 'uniforms';
const CustomImage = styled('img')(({ theme }) => ({
  height: theme.spacing(20),
  width: theme.spacing(20),
}));

const CustomImageIcon = styled(ImageIcon)(({ theme }) => ({
  height: theme.spacing(20),
  width: theme.spacing(20),
}));
// @dev check here how to connect uniforms and custom form components: https://github.com/react-page/react-page/blob/master/packages/editor/src/ui/ColorPicker/ColorPickerField.tsx
export const ImagePicker = connectField<{
  value: string;
  label: string;
  onChange: (v: string | void) => void;
}>((props) => {
  const [openMediaDialog, setOpenMediaDialog] = useState(false);
  return (
    <Container>
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
          props.onChange(file.url);
        }}
      />
      <Stack>
        <Typography variant="body2">
          <FormattedMessage id={props.label} defaultMessage={props.label} />
        </Typography>
        <Button
          onClick={() => {
            setOpenMediaDialog(true);
          }}
        >
          {props.value ? (
            <CustomImage src={props.value} />
          ) : (
            <CustomImageIcon />
          )}
        </Button>
      </Stack>
    </Container>
  );
});
