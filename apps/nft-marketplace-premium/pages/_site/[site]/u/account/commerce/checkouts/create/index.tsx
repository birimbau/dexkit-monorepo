import CheckoutCartTable from '@/modules/commerce/components/CheckoutCartTable';
import DashboardLayout from '@/modules/commerce/components/layout/DashboardLayout';
import { Button, Container, Grid } from '@mui/material';
import { Field, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { FormattedMessage } from 'react-intl';

export default function CreateCheckoutPage() {
  const handleSubmit = async () => {};

  return (
    <DashboardLayout page="checkout">
      <Container>
        <Formik initialValues={{}} onSubmit={handleSubmit}>
          {({ submitForm, isSubmitting, isValid }) => (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Field component={TextField} name="title" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <CheckoutCartTable name="items" />
              </Grid>
              <Grid item xs={12}>
                <Button
                  onClick={submitForm}
                  disabled={!isValid || isSubmitting}
                >
                  <FormattedMessage id="create" defaultMessage="Create" />
                </Button>
              </Grid>
            </Grid>
          )}
        </Formik>
      </Container>
    </DashboardLayout>
  );
}
