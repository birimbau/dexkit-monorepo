import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { FormattedMessage } from 'react-intl';
import * as Yup from 'yup';
import { AppConfig } from '../../../../types/config';

interface Props {
  config: AppConfig;
  onSave: (config: AppConfig) => void;
}

interface AnalyticsOptions {
  googleAnalytics?: string;
}

const AnalyticOptionsSchema: Yup.SchemaOf<AnalyticsOptions> =
  Yup.object().shape({
    googleAnalytics: Yup.string(),
  });

export default function AnalyticsWizardContainer({ config, onSave }: Props) {
  return (
    <Formik
      initialValues={{
        googleAnalytics: config.analytics?.gtag,
      }}
      validationSchema={AnalyticOptionsSchema}
      onSubmit={(value, helpers) => {
        let analytics = { ...config?.analytics };
        analytics.gtag = value.googleAnalytics;
        config.analytics = analytics;
        onSave(config);
        helpers.resetForm();
      }}
    >
      {({ submitForm }) => (
        <Form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Stack>
                <Typography variant={'subtitle2'}>
                  <FormattedMessage id="Analytics" defaultMessage="Analytics" />
                </Typography>
                <Typography variant={'body2'}>
                  <FormattedMessage
                    id="edit.analytics"
                    defaultMessage="Edit analytics"
                  />
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <Stack spacing={2}>
                <Box>
                  <Field
                    component={TextField}
                    name="googleAnalytics"
                    label={
                      <FormattedMessage
                        id={'google.analytics.tag'}
                        defaultMessage={'Google analytics tag'}
                      />
                    }
                  />
                </Box>
                <Box>
                  <Typography variant={'body2'}>
                    <FormattedMessage
                      id={'google.analytics.example.tag'}
                      defaultMessage={' Example of tag: G-LWRHJH7JLF'}
                    />
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1} direction="row" justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={submitForm}
                >
                  <FormattedMessage id="save" defaultMessage="Save" />
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}
