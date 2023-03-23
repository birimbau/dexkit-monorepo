import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Field, Form, Formik } from 'formik';
import { CheckboxWithLabel } from 'formik-mui';
import { FormattedMessage, useIntl } from 'react-intl';
import * as Yup from 'yup';
import { AppConfig } from '../../../../types/config';

interface Props {
  config: AppConfig;
  onSave: (config: AppConfig) => void;
}

interface HideOptions {
  hide_powered_by?: boolean;
}

const SocialOptionsSchema: Yup.SchemaOf<HideOptions> = Yup.object().shape({
  hide_powered_by: Yup.boolean(),
});

export default function HidePoweredContainer({ config, onSave }: Props) {
  const { formatMessage } = useIntl();
  return (
    <Formik
      initialValues={{
        hide_powered_by: config.hide_powered_by || false,
      }}
      validationSchema={SocialOptionsSchema}
      onSubmit={(values, helpers) => {
        config.hide_powered_by = values.hide_powered_by;
        onSave(config);
      }}
    >
      {({ submitForm }) => (
        <Form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Stack>
                <Typography variant={'subtitle2'}>
                  <FormattedMessage
                    id="powered.by.dexkit"
                    defaultMessage="Powered by DexKit"
                  />
                </Typography>
                <Typography variant={'body2'}>
                  <FormattedMessage
                    id="edit.hide.powered.by.dexkit"
                    defaultMessage="Edit powered by DexKit"
                  />
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <FormattedMessage
                id="powered.by.dexkit.info"
                defaultMessage="You need to associate an NFT to your app to use this feature."
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                component={CheckboxWithLabel}
                name="hide_powered_by"
                type={'checkbox'}
                Label={{
                  label: formatMessage({
                    id: 'hide.powered.by.dexkit',
                    defaultMessage: 'Hide Powered by DexKit',
                  }),
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
