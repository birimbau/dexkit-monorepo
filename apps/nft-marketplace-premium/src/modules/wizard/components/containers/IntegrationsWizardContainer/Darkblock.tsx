import { Button, Grid } from '@mui/material';
import { FormattedMessage } from 'react-intl';

import { Field, Formik } from 'formik';
import { TextField } from 'formik-mui';

export default function Darkblock() {
  return (
    <Formik initialValues={{ enableWidget: false }} onSubmit={() => {}}>
      {({ submitForm, isSubmitting, isValid }) => (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Field
              component={TextField}
              name="enableWidget"
              size="small"
              label={
                <FormattedMessage
                  id="enable.widget"
                  defaultMessage="Enable Widget"
                />
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
