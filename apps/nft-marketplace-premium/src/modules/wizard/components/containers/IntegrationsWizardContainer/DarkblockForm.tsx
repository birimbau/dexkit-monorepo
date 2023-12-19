import { Box, Button, FormControlLabel, Grid, Switch } from '@mui/material';
import { FormattedMessage } from 'react-intl';

import {
  useIntegrationDataQuery,
  useSaveIntegrationMutation,
} from '@/modules/wizard/hooks/integrations';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';

export interface DarkblockFormProps {
  siteId?: number;
}

export default function DarkblockForm({ siteId }: DarkblockFormProps) {
  const darkblockQuery = useIntegrationDataQuery({ type: 'darkblock', siteId });
  const saveApiKeyMutation = useSaveIntegrationMutation({
    type: 'darkblock',
    siteId,
  });

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async ({
    enableDarkblock,
  }: {
    enableDarkblock: boolean;
  }) => {
    try {
      if (siteId) {
        await saveApiKeyMutation.mutateAsync({
          data: { enableDarkblock },
        });
        enqueueSnackbar(
          <FormattedMessage
            id="saved.successfully"
            defaultMessage="Saved successfully"
          />,
          { variant: 'success' },
        );
      }
    } catch (err) {
      enqueueSnackbar(String(enqueueSnackbar), { variant: 'error' });
    }
  };

  return darkblockQuery.isFetched ? (
    <Formik
      initialValues={
        darkblockQuery.data
          ? darkblockQuery.data?.settings
          : { enableDarkblock: false }
      }
      onSubmit={handleSubmit}
    >
      {({
        submitForm,
        isSubmitting,
        isValid,
        setFieldValue,
        values,
        touched,
      }) => (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box px={1}>
              <FormControlLabel
                control={
                  <Switch
                    onChange={(e) =>
                      setFieldValue('enableDarkblock', e.target.checked)
                    }
                    size="small"
                    checked={values.enableDarkblock}
                  />
                }
                label={
                  <FormattedMessage
                    id="enable.darkblock"
                    defaultMessage="Enable Darkblock"
                  />
                }
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              disabled={isSubmitting || !isValid || !touched}
              onClick={submitForm}
            >
              <FormattedMessage id="save" defaultMessage="Save" />
            </Button>
          </Grid>
        </Grid>
      )}
    </Formik>
  ) : null;
}
