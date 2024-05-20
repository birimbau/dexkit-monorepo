import { Box, Container, Stack, styled, Typography } from '@mui/material';
import { useState } from 'react';

import MediaDialog from '@dexkit/ui/components/mediaDialog';
import ImageIcon from '@mui/icons-material/Image';
import { FormattedMessage } from 'react-intl';
import { connectField, useForm } from 'uniforms';

const CustomImage = styled('img')(({ theme }) => ({
  height: theme.spacing(20),
  width: 'auto',
}));

const CustomImageIcon = styled(ImageIcon)(({ theme }) => ({
  height: theme.spacing(20),
  width: 'auto',
}));

// @dev check here how to connect uniforms and custom form components: https://github.com/react-page/react-page/blob/master/packages/editor/src/ui/ColorPicker/ColorPickerField.tsx
export const ImagePicker = connectField<{
  value: string;
  label: string;
  onChange: (v: string | void) => void;
}>((props) => {
  const [openMediaDialog, setOpenMediaDialog] = useState(false);

  const { formRef } = useForm();

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

          const image = new Image();

          image.src = file.url;

          image.onload = () => {
            formRef.change('width', image.width);
            formRef.change('height', image.height);
          };
        }}
      />
      <Stack alignItems="center" spacing={1}>
        <Typography variant="body2">
          <FormattedMessage id={props.label} defaultMessage={props.label} />
        </Typography>
        <Box
          onClick={() => {
            setOpenMediaDialog(true);
          }}
        >
          {props.value ? (
            <CustomImage src={props.value} />
          ) : (
            <CustomImageIcon />
          )}
        </Box>
      </Stack>
    </Container>
  );
});
