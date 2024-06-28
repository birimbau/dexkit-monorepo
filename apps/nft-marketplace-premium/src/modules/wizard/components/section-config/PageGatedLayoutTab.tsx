import {
  Box,
  ButtonBase,
  Grid,
  Stack,
  Typography,
  alpha,
  styled,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';

import MediaDialog from '@dexkit/ui/components/mediaDialog';
import { AccountFile } from '@dexkit/ui/modules/file/types';
import { GatedPageLayout } from '@dexkit/ui/modules/wizard/types';
import { Field, Formik, FormikHelpers } from 'formik';
import { TextField } from 'formik-mui';
import { useState } from 'react';
import ChangeListener from '../ChangeListener';

const CustomImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: 'auto',
  display: 'block',
}));

export interface PageGatedLayoutTabProps {
  layout?: GatedPageLayout;
  onSaveGatedLayout: (layout?: GatedPageLayout) => void;
}

export default function PageGatedLayoutTab({
  layout,
  onSaveGatedLayout,
}: PageGatedLayoutTabProps) {
  const handleSubmit = async (
    values: { layout: GatedPageLayout },
    helpers: FormikHelpers<any>,
  ) => {
    onSaveGatedLayout(values.layout);
    helpers.resetForm();
  };

  const [showSelect, setShowSelect] = useState(false);
  const [mode, setMode] = useState<string>();

  const handleSelectImage = (mode: string) => {
    return () => {
      setShowSelect(true);
      setMode(mode);
    };
  };

  const handleSelectClose = () => {
    setShowSelect(false);
  };

  const handleSelectFile = (
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean | undefined,
    ) => void,
    setFieldTouched: (
      field: string,
      isTouched?: boolean | undefined,
      shouldValidate?: boolean | undefined,
    ) => void,
  ) => {
    return (file: AccountFile) => {
      if (mode === 'light') {
        setFieldValue('layout.frontImage', file.url);
        setFieldTouched('layout.frontImage');
      } else if (mode === 'dark') {
        setFieldValue('layout.frontImageDark', file.url);
        setFieldTouched('layout.frontImageDark');
      }
    };
  };

  return (
    <Formik
      initialValues={
        layout
          ? { layout }
          : {
              layout: {
                accessRequirementsMessage: '',
                frontImage: '',
                frontImageHeight: 150,
                frontImageWidth: 150,
              },
            }
      }
      onSubmit={handleSubmit}
    >
      {({
        submitForm,
        setFieldValue,
        values,
        isValid,
        touched,
        setFieldTouched,
      }) => (
        <>
          {touched.layout && (
            <ChangeListener
              values={values}
              isValid={isValid}
              onChange={(values: any) => onSaveGatedLayout(values.layout)}
            />
          )}

          {showSelect && (
            <MediaDialog
              dialogProps={{
                open: showSelect,
                maxWidth: 'lg',
                fullWidth: true,
                onClose: handleSelectClose,
              }}
              onConfirmSelectFile={handleSelectFile(
                setFieldValue,
                setFieldTouched,
              )}
            />
          )}

          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body1" fontWeight="bold">
                  <FormattedMessage
                    id="cover.image"
                    defaultMessage="Cover image"
                  />
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Stack spacing={2}>
                        <Typography variant="body1">
                          <FormattedMessage
                            id="cover.image.for.light.mode"
                            defaultMessage="Cover image for light mode"
                          />
                        </Typography>
                        <ButtonBase
                          sx={{
                            position: 'relative',
                            p: 2,
                            borderRadius: (theme) =>
                              theme.shape.borderRadius / 2,
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            backgroundColor: (theme) =>
                              theme.palette.mode === 'light'
                                ? 'rgba(0,0,0, 0.2)'
                                : alpha(theme.palette.common.white, 0.1),
                          }}
                          onClick={handleSelectImage('light')}
                        >
                          <Stack
                            sx={{
                              height: (theme) => theme.spacing(20),

                              width: (theme) => theme.spacing(20),
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <CustomImage src={values.layout.frontImage} />
                          </Stack>
                        </ButtonBase>
                      </Stack>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Stack spacing={2}>
                        <Typography variant="body1">
                          <FormattedMessage
                            id="cover.image.for.dark.mode"
                            defaultMessage="Cover image for dark mode"
                          />
                        </Typography>
                        <ButtonBase
                          sx={{
                            backgroundColor: 'black',
                            width: '100%',
                            p: 2,
                            borderRadius: (theme) =>
                              theme.shape.borderRadius / 2,
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                          }}
                          onClick={handleSelectImage('dark')}
                        >
                          <Stack
                            sx={{
                              height: (theme) => theme.spacing(20),
                              width: (theme) => theme.spacing(20),
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <CustomImage src={values.layout.frontImageDark} />
                          </Stack>
                        </ButtonBase>
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <FormattedMessage
                        id="cover.image.size"
                        defaultMessage="Cover image size"
                      />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Field
                      component={TextField}
                      type="text"
                      fullWidth
                      label={
                        <FormattedMessage
                          id="width.px"
                          defaultMessage="Width(px)"
                        />
                      }
                      name="layout.frontImageWidth"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Field
                      component={TextField}
                      type="text"
                      fullWidth
                      label={
                        <FormattedMessage
                          id="heigth.px"
                          defaultMessage="Height(px)"
                        />
                      }
                      name="layout.frontImageHeight"
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Field
                  component={TextField}
                  type="text"
                  fullWidth
                  label={
                    <FormattedMessage
                      id="access.requirements.message"
                      defaultMessage="Access requirements message"
                    />
                  }
                  name="layout.accessRequirementsMessage"
                />
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </Formik>
  );
}
