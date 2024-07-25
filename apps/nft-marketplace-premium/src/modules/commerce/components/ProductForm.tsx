import FormikDecimalInput from '@dexkit/ui/components/FormikDecimalInput';
import MediaDialog from '@dexkit/ui/components/mediaDialog';
import { AccountFile } from '@dexkit/ui/modules/file/types';
import Image from '@mui/icons-material/Image';
import {
  alpha,
  Box,
  Button,
  ButtonBase,
  Divider,
  Grid,
  InputAdornment,
  Stack,
} from '@mui/material';
import { Field, useFormikContext } from 'formik';
import { TextField } from 'formik-mui';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { ProductFormType } from '../types';

export interface ProductFormProps {
  onSubmit: () => void;
  isValid?: boolean;
}

export default function ProductForm({ onSubmit, isValid }: ProductFormProps) {
  const { setFieldValue, values } = useFormikContext<ProductFormType>();

  const handleSelectFile = (file: AccountFile) => {
    setFieldValue('imageUrl', file.url);
  };

  const [showSelectFile, setShowSelectFile] = useState(false);

  const handleSelectOpen = () => {
    setShowSelectFile(true);
  };

  const handleClose = () => {
    setShowSelectFile(false);
  };

  return (
    <>
      <MediaDialog
        onConfirmSelectFile={handleSelectFile}
        dialogProps={{ open: showSelectFile, onClose: handleClose }}
      />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <ButtonBase
            onClick={handleSelectOpen}
            sx={{
              position: 'relative',
              p: 2,
              borderRadius: (theme) => theme.shape.borderRadius / 2,
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                  ? 'rgba(0,0,0, 0.2)'
                  : alpha(theme.palette.common.white, 0.1),

              backgroundImage: values.imageUrl
                ? `url("${values.imageUrl}")`
                : undefined,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
          >
            <Stack
              sx={{
                height: 150,
                maxHeight: 300,
                minHeight: 50,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                color: (theme) =>
                  theme.palette.getContrastText(
                    theme.palette.mode === 'light'
                      ? 'rgba(0,0,0, 0.2)'
                      : alpha(theme.palette.common.white, 0.1),
                  ),
              }}
            >
              {!values.imageUrl && <Image fontSize="large" />}
            </Stack>
          </ButtonBase>
        </Grid>
        <Grid item xs={12}>
          <Field
            component={TextField}
            name="name"
            fullWidth
            label={<FormattedMessage id="name" defaultMessage="Name" />}
          />
        </Grid>
        <Grid item xs={12}>
          <FormikDecimalInput
            name="price"
            TextFieldProps={{
              fullWidth: true,
              label: <FormattedMessage id="price" defaultMessage="Price" />,
              InputProps: {
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              },
            }}
            decimals={6}
          />
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Box>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
              spacing={2}
            >
              <Button>
                <FormattedMessage id="cancel" defaultMessage="cancel" />
              </Button>
              <Button
                onClick={onSubmit}
                disabled={!isValid}
                variant="contained"
              >
                <FormattedMessage id="save" defaultMessage="Save" />
              </Button>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
