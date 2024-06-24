import React from 'react';

import {
  Box,
  Button,
  ButtonBase,
  Grid,
  Stack,
  Typography,
  alpha,
  styled,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';

import { Field, Formik } from 'formik';
import { TextField } from 'formik-mui';

const CustomImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: 'auto',
  display: 'block',
}));

export interface PageGatedLayoutTabProps {}

export default function PageGatedLayoutTab({}: PageGatedLayoutTabProps) {
  const handleSubmit = async () => {};

  return (
    <Formik initialValues={{}} onSubmit={handleSubmit}>
      {({ submitForm, setFieldValue }) => (
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button variant="outlined" color="primary">
                <FormattedMessage
                  id="add.condition"
                  defaultMessage="Add condition"
                />
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <FormattedMessage
                  id="cover.image"
                  defaultMessage="Cover image"
                />
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
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
                      borderRadius: (theme) => theme.shape.borderRadius / 2,
                      alignItems: 'center',
                      justifyContent: 'center',

                      backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                          ? 'rgba(0,0,0, 0.2)'
                          : alpha(theme.palette.common.white, 0.1),
                    }}
                    onClick={() => {}}
                  >
                    <Stack
                      sx={{
                        height: (theme) => theme.spacing(20),

                        width: (theme) => theme.spacing(20),
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CustomImage />
                    </Stack>
                  </ButtonBase>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <FormattedMessage
                      id="cover.image.for.dark.mode"
                      defaultMessage="Cover image for dark mode"
                    />
                  </Typography>
                  <ButtonBase
                    sx={{
                      backgroundColor: 'black',

                      p: 2,
                      borderRadius: (theme) => theme.shape.borderRadius / 2,
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                    onClick={() => {}}
                  >
                    <Stack
                      sx={{
                        height: (theme) => theme.spacing(20),
                        width: (theme) => theme.spacing(20),
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CustomImage />
                    </Stack>
                  </ButtonBase>
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
      )}
    </Formik>
  );
}
