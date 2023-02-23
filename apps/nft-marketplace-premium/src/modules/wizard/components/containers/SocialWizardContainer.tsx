import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import { FormattedMessage } from 'react-intl';
import { AppConfig, SocialMedia } from '../../../../types/config';
import * as Yup from 'yup';
import InputAdornment from '@mui/material/InputAdornment';

interface Props {
  config: AppConfig;
  onSave: (config: AppConfig) => void;
}

interface SocialOptions {
  twitter?: string;
  instagram?: string;
}

const SocialOptionsSchema: Yup.SchemaOf<SocialOptions> = Yup.object().shape({
  twitter: Yup.string(),
  instagram: Yup.string(),
});

export default function SocialWizardContainer({ config, onSave }: Props) {
  return (
    <Formik
      initialValues={{
        twitter: config.social?.find((s) => s.type === 'twitter')?.handle,
        instagram: config.social?.find((s) => s.type === 'instagram')?.handle,
      }}
      validationSchema={SocialOptionsSchema}
      onSubmit={(values, helpers) => {
        const socials: SocialMedia[] = [];
        if (values.twitter) {
          socials.push({ type: 'twitter', handle: values.twitter });
        }
        if (values.instagram) {
          socials.push({ type: 'instagram', handle: values.instagram });
        }

        config.social = socials;
        onSave(config);
      }}
    >
      {({ submitForm }) => (
        <Form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Stack>
                <Typography variant={'subtitle2'}>
                  <FormattedMessage id="social" defaultMessage="Social" />
                </Typography>
                <Typography variant={'body2'}>
                  <FormattedMessage
                    id="edit.social"
                    defaultMessage="Edit social"
                  />
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <Field
                component={TextField}
                name="instagram"
                label={
                  <FormattedMessage
                    id={'instagram'}
                    defaultMessage={'Instagram'}
                  />
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <InstagramIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                component={TextField}
                name="twitter"
                label={
                  <FormattedMessage id={'twitter'} defaultMessage={'Twitter'} />
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TwitterIcon />
                    </InputAdornment>
                  ),
                }}
              />
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
