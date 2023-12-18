import { Button, Grid } from '@mui/material';
import { FormattedMessage } from 'react-intl';

import { Field, Formik } from 'formik';
import { TextField } from 'formik-mui';

export default function ZrxForm() {
  return (
    <Formik initialValues={{ apiToken: '' }} onSubmit={() => {}}>
      {({ submitForm, isSubmitting, isValid }) => (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Field
              component={TextField}
              name="apiToken"
              size="small"
              label={
                <FormattedMessage id="api.token" defaultMessage="Api Token" />
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              disabled={isSubmitting || !isValid}
              onClick={submitForm}
            >
              <FormattedMessage id="save" defaultMessage="Save" />
            </Button>
          </Grid>
        </Grid>
      )}
    </Formik>
  );
}
