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
import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { CURRENCIES, LANGUAGES } from 'src/constants';

import ImageIcon from '@mui/icons-material/Image';
import * as Yup from 'yup';
import MediaDialog from '../../../../components/mediaDialog';
import { StepperButtonProps } from '../../types';
import InputInfoAdornment from '../InputInfoAdornment';
import { StepperButtons } from '../steppers/StepperButtons';
export interface GeneralSectionForm {
  name: string;
  email: string;
  locale: string;
  currency: string;
  logoUrl: string;
  logoDarkUrl?: string;
  faviconUrl: string;
  logoWidth?: number;
  logoHeight?: number;
  logoWidthMobile?: number;
  logoHeightMobile?: number;
}

const FormSchema: Yup.SchemaOf<GeneralSectionForm> = Yup.object().shape({
  email: Yup.string().email().required(),
  name: Yup.string().required(),
  locale: Yup.string().required(),
  currency: Yup.string().required(),
  logoUrl: Yup.string().url().required(),
  logoDarkUrl: Yup.string().url(),
  faviconUrl: Yup.string().url().required(),
  logoWidth: Yup.number().min(0),
  logoHeight: Yup.number().min(0),
  logoWidthMobile: Yup.number().min(0),
  logoHeightMobile: Yup.number().min(0),
});

interface Props {
  isEdit?: boolean;
  initialValues?: GeneralSectionForm;
  onSubmit?: (form: GeneralSectionForm) => void;
  onChange?: (form: GeneralSectionForm) => void;
  isOnStepper?: boolean;
  stepperButtonProps?: StepperButtonProps;
}

const CustomImage = styled('img')(({ theme }) => ({
  height: theme.spacing(20),
  width: theme.spacing(20),
}));

const NoImage = styled(ImageIcon)(({ theme }) => ({
  height: theme.spacing(20),
  width: theme.spacing(20),
}));

const FaviconImage = styled('img')(({ theme }) => ({
  height: theme.spacing(10),
  width: theme.spacing(10),
}));

function OnChangeListener({
  values,
  isValid,
  onChange,
}: {
  values: any;
  isValid: any;
  onChange: any;
}) {
  useEffect(() => {
    if (onChange) {
      onChange(values);
    }
  }, [values, isValid]);

  return <></>;
}

export default function GeneralSection({
  onSubmit,
  onChange,
  initialValues,
  isOnStepper,
  stepperButtonProps,
}: Props) {
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
      logoDarkUrl: '',
      faviconUrl: '',
      logoHeight: 48,
      logoWidth: 48,
      logoHeightMobile: 48,
      logoWidthMobile: 48,
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
            if (onChange) {
              onChange({ ...formik.values, [mediaFieldToEdit]: file.url });
            }
          }
          setMediaFieldToEdit(undefined);
          setOpenMediaDialog(false);
        }}
      />

      <Stack>
        <form onSubmit={formik.handleSubmit}>
          <OnChangeListener
            values={formik.values}
            onChange={onChange}
            isValid={formik.isValid}
          />
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
              <Stack spacing={2}>
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

                <TextField
                  fullWidth
                  type="number"
                  name="logoWidth"
                  label={
                    <FormattedMessage
                      id="logo.width"
                      defaultMessage="Logo width (px)"
                    />
                  }
                  InputLabelProps={{ shrink: true }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.logoWidth}
                  error={
                    Boolean(formik.errors.logoWidth) && formik.touched.logoWidth
                  }
                  helperText={
                    Boolean(formik.errors.logoWidth) && formik.touched.logoWidth
                      ? formik.errors.logoWidth
                      : undefined
                  }
                />
                <TextField
                  fullWidth
                  type="number"
                  name="logoWidthMobile"
                  label={
                    <FormattedMessage
                      id="logo.width.on.mobile"
                      defaultMessage="Logo width on Mobile (px)"
                    />
                  }
                  InputLabelProps={{ shrink: true }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.logoWidthMobile}
                  error={
                    Boolean(formik.errors.logoWidthMobile) &&
                    formik.touched.logoWidthMobile
                  }
                  helperText={
                    Boolean(formik.errors.logoWidthMobile) &&
                    formik.touched.logoWidthMobile
                      ? formik.errors.logoWidthMobile
                      : undefined
                  }
                />
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack spacing={2}>
                <Typography variant="body2">
                  <FormattedMessage
                    id="logo.for.dark.mode"
                    defaultMessage="Logo for Dark Mode"
                  />
                </Typography>
                <Button
                  onClick={() => {
                    setOpenMediaDialog(true);
                    setMediaFieldToEdit('logoDarkUrl');
                  }}
                >
                  {formik.values?.logoDarkUrl ? (
                    <CustomImage src={formik.values.logoDarkUrl} />
                  ) : (
                    <NoImage />
                  )}
                </Button>
                <TextField
                  fullWidth
                  type="number"
                  name="logoHeight"
                  label={
                    <FormattedMessage
                      id="logo.height"
                      defaultMessage="Logo height (px)"
                    />
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.logoHeight}
                  InputLabelProps={{ shrink: true }}
                  error={
                    Boolean(formik.errors.logoHeight) &&
                    formik.touched.logoHeight
                  }
                  helperText={
                    Boolean(formik.errors.logoHeight) &&
                    formik.touched.logoHeight
                      ? formik.errors.logoHeight
                      : undefined
                  }
                />
                <TextField
                  fullWidth
                  type="number"
                  name="logoHeightMobile"
                  label={
                    <FormattedMessage
                      id="logo.height.on.mobile"
                      defaultMessage="Logo height on Mobile (px)"
                    />
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.logoHeightMobile}
                  InputLabelProps={{ shrink: true }}
                  error={
                    Boolean(formik.errors.logoHeightMobile) &&
                    formik.touched.logoHeightMobile
                  }
                  helperText={
                    Boolean(formik.errors.logoHeightMobile) &&
                    formik.touched.logoHeightMobile
                      ? formik.errors.logoHeightMobile
                      : undefined
                  }
                />
              </Stack>
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
                  {LANGUAGES.map((lang, index) => (
                    <MenuItem key={index} value={lang.locale}>
                      {lang.name}
                    </MenuItem>
                  ))}
                </Select>
                {Boolean(formik.errors.locale) && (
                  <FormHelperText
                    sx={{ color: (theme) => theme.vars.palette.error.main }}
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
                  {CURRENCIES.map((curr, index) => (
                    <MenuItem key={index} value={curr.symbol}>
                      {curr.name}
                    </MenuItem>
                  ))}
                </Select>
                {Boolean(formik.errors.currency) && (
                  <FormHelperText
                    sx={{ color: (theme) => theme.vars.palette.error.main }}
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
              {isOnStepper ? (
                <StepperButtons
                  {...stepperButtonProps}
                  handleNext={() => {
                    formik.submitForm();
                    if (stepperButtonProps?.handleNext) {
                      stepperButtonProps.handleNext();
                    }
                  }}
                  disableContinue={
                    !formik.isValid ||
                    !formik.values.email ||
                    !formik.values.name
                  }
                />
              ) : (
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
              )}
            </Grid>
          </Grid>
        </form>
      </Stack>
    </>
  );
}
