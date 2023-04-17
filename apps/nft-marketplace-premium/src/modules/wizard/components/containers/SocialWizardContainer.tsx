import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PinterestIcon from '@mui/icons-material/Pinterest';
import RedditIcon from '@mui/icons-material/Reddit';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { FormattedMessage } from 'react-intl';
import * as Yup from 'yup';
import { AppConfig, SocialMedia } from '../../../../types/config';

interface Props {
  config: AppConfig;
  onSave: (config: AppConfig) => void;
}

interface SocialOptions {
  twitter?: string;
  instagram?: string;
  facebook?: string;
}

const SocialOptionsSchema: Yup.SchemaOf<SocialOptions> = Yup.object().shape({
  twitter: Yup.string(),
  instagram: Yup.string(),
  facebook: Yup.string(),
});

export default function SocialWizardContainer({ config, onSave }: Props) {
  return (
    <Formik
      initialValues={{
        twitter: config.social?.find((s) => s.type === 'twitter')?.handle,
        instagram: config.social?.find((s) => s.type === 'instagram')?.handle,
        facebook: config.social?.find((s) => s.type === 'facebook')?.handle,
        linkedin: config.social?.find((s) => s.type === 'linkedin')?.handle,
        pinterest: config.social?.find((s) => s.type === 'pinterest')?.handle,
        youtube: config.social?.find((s) => s.type === 'youtube')?.handle,
        reddit: config.social?.find((s) => s.type === 'reddit')?.handle,
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
        if (values.facebook) {
          socials.push({ type: 'facebook', handle: values.facebook });
        }
        if (values.linkedin) {
          socials.push({ type: 'linkedin', handle: values.linkedin });
        }
        if (values.pinterest) {
          socials.push({ type: 'pinterest', handle: values.pinterest });
        }
        if (values.reddit) {
          socials.push({ type: 'reddit', handle: values.reddit });
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
              <Field
                component={TextField}
                name="youtube"
                label={
                  <FormattedMessage id={'youtube'} defaultMessage={'Youtube'} />
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <YouTubeIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                component={TextField}
                name="linkedin"
                label={
                  <FormattedMessage
                    id={'linkedin'}
                    defaultMessage={'Linkedin'}
                  />
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LinkedInIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                component={TextField}
                name="facebook"
                label={
                  <FormattedMessage
                    id={'facebook'}
                    defaultMessage={'Facebook'}
                  />
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FacebookIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Field
                component={TextField}
                name="reddit"
                label={
                  <FormattedMessage id={'reddit'} defaultMessage={'Reddit'} />
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <RedditIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                component={TextField}
                name="pinterest"
                label={
                  <FormattedMessage
                    id={'pinterest'}
                    defaultMessage={'Pinterest'}
                  />
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PinterestIcon />
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
