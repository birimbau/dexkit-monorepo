import {
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import { FormikHelpers, useFormik } from 'formik';
import { useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import * as Yup from 'yup';
import MediaDialog from '../../../../components/mediaDialog';
import InputInfoAdornment from '../InputInfoAdornment';

export interface GeneralSectionForm {
  name: string;
  email: string;
  locale: string;
  currency: string;
  logoUrl: string;
  faviconUrl: string;
}

const FormSchema: Yup.SchemaOf<GeneralSectionForm> = Yup.object().shape({
  email: Yup.string().email().required(),
  name: Yup.string().required(),
  locale: Yup.string().required(),
  currency: Yup.string().required(),
  logoUrl: Yup.string().url().required(),
  faviconUrl: Yup.string().url().required(),
});

interface Props {
  isEdit?: boolean;
  initialValues?: GeneralSectionForm;
  onSubmit?: (form: GeneralSectionForm) => void;
}

const CustomImage = styled('img')(({ theme }) => ({
  height: theme.spacing(20),
  width: theme.spacing(20),
}));

const FaviconImage = styled('img')(({ theme }) => ({
  height: theme.spacing(10),
  width: theme.spacing(10),
}));

export default function GeneralSection({ onSubmit, initialValues }: Props) {
  const [openMediaDialog, setOpenMediaDialog] = useState(false);
  const [mediaFieldToEdit, setMediaFieldToEdit] = useState<string>();

  const handleSubmit = useCallback(
    (
      values: GeneralSectionForm,
      formikHelpers: FormikHelpers<GeneralSectionForm>
    ) => {
      if (onSubmit) {
        onSubmit(values);
      }
    },
    [onSubmit]
  );

  const formik = useFormik<GeneralSectionForm>({
    initialValues: initialValues || {
      email: '',
      name: '',
      currency: 'usd',
      locale: 'en-US',
      logoUrl: '',
      faviconUrl: '',
    },
    enableReinitialize: true,
    onSubmit: handleSubmit,
    validationSchema: FormSchema,
  });

  return (
    <>
      <MediaDialog
        dialogProps={{
          open: openMediaDialog,
          maxWidth: 'lg',
          fullWidth: true,
          onClose: () => {
            setOpenMediaDialog(false);
            setMediaFieldToEdit(undefined);
          },
        }}
        onConfirmSelectFile={(file) => {
          if (mediaFieldToEdit && file) {
            formik.setFieldValue(mediaFieldToEdit, file.url);
          }
          setMediaFieldToEdit(undefined);
          setOpenMediaDialog(false);
        }}
      />

      <Stack>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="name"
                label={<FormattedMessage id="name" defaultMessage="Name" />}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={
                  Boolean(formik.errors.name) && formik.touched.name
                    ? formik.errors.name
                    : undefined
                }
                InputProps={{
                  endAdornment: <InputInfoAdornment field={'name'} />,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="email"
                name="email"
                label={<FormattedMessage id="email" defaultMessage="E-mail" />}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                error={Boolean(formik.errors.email) && formik.touched.email}
                helperText={
                  Boolean(formik.errors.email) && formik.touched.email
                    ? formik.errors.email
                    : undefined
                }
                InputProps={{
                  endAdornment: <InputInfoAdornment field={'email'} />,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">
                <FormattedMessage id="logo" defaultMessage="Logo" />
              </Typography>
              <Button
                onClick={() => {
                  setOpenMediaDialog(true);
                  setMediaFieldToEdit('logoUrl');
                }}
              >
                <CustomImage src={formik.values.logoUrl} />
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">
                <FormattedMessage id="favicon" defaultMessage="Favicon" />
              </Typography>
              <Button
                onClick={() => {
                  setOpenMediaDialog(true);
                  setMediaFieldToEdit('faviconUrl');
                }}
              >
                <FaviconImage src={formik.values.faviconUrl} />
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>
                  <FormattedMessage id="language" defaultMessage="Language" />
                </InputLabel>
                <Select
                  name="locale"
                  onChange={formik.handleChange}
                  value={formik.values.locale}
                  fullWidth
                  label={
                    <FormattedMessage id="language" defaultMessage="Language" />
                  }
                  error={Boolean(formik.errors.locale)}
                >
                  <MenuItem value="en-US">English (US)</MenuItem>
                </Select>
                {Boolean(formik.errors.locale) && (
                  <FormHelperText
                    sx={{ color: (theme) => theme.palette.error.main }}
                  >
                    {formik.errors.locale}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>
                  <FormattedMessage id="currency" defaultMessage="Currency" />
                </InputLabel>
                <Select
                  name="currency"
                  onChange={formik.handleChange}
                  value={formik.values.currency}
                  fullWidth
                  label={
                    <FormattedMessage id="currency" defaultMessage="Currency" />
                  }
                  error={Boolean(formik.errors.currency)}
                >
                  <MenuItem value="usd">USD</MenuItem>
                </Select>
                {Boolean(formik.errors.currency) && (
                  <FormHelperText
                    sx={{ color: (theme) => theme.palette.error.main }}
                  >
                    {formik.errors.currency}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1} direction="row" justifyContent="flex-end">
                <Button
                  disabled={!formik.isValid}
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  <FormattedMessage id="save" defaultMessage="Save" />
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </Stack>
    </>
  );
}
