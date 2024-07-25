import CheckoutItemsTable from '@/modules/commerce/components/CheckoutItemsTable';

const AddProductsDialog = dynamic(
  () => import('@/modules/commerce/components/dialogs/AddProductsDialog'),
);

import DashboardLayout from '@/modules/commerce/components/layout/DashboardLayout';
import useCreateCheckout from '@/modules/commerce/hooks/checkout/useCreateCheckout';
import { CheckoutSchema } from '@/modules/commerce/schemas';
import { CheckoutFormType, CheckoutItemType } from '@/modules/commerce/types';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import {
  Box,
  Button,
  Container,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  Stack,
} from '@mui/material';
import { Field, FieldArray, Formik } from 'formik';
import { Checkbox, TextField } from 'formik-mui';
import dynamic from 'next/dynamic';
import { useSnackbar } from 'notistack';
import { FormattedMessage } from 'react-intl';
import { toFormikValidationSchema } from 'zod-formik-adapter';

function CreateCheckoutComponent() {
  const { mutateAsync: createCheckout } = useCreateCheckout();

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (values: CheckoutFormType) => {
    try {
      await createCheckout(values);
      enqueueSnackbar(
        <FormattedMessage
          id="checkout.created"
          defaultMessage="Checkout Created"
        />,
        { variant: 'success' },
      );
    } catch (err) {
      enqueueSnackbar(String(err), { variant: 'error' });
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          requireEmail: false,
          requireAccount: false,
          name: '',
          description: '',
          items: [],
        }}
        onSubmit={handleSubmit}
        validationSchema={toFormikValidationSchema(CheckoutSchema)}
      >
        {({ submitForm, isSubmitting, isValid, errors }) => (
          <Container>
            <Stack spacing={2}>
              <PageHeader
                breadcrumbs={[
                  {
                    caption: (
                      <FormattedMessage
                        id="commerce"
                        defaultMessage="Commerce"
                      />
                    ),
                    uri: '/u/account/commerce',
                  },
                  {
                    caption: (
                      <FormattedMessage
                        id="checkouts"
                        defaultMessage="Checkouts"
                      />
                    ),
                    uri: '/u/account/commerce/checkouts',
                  },
                  {
                    caption: (
                      <FormattedMessage id="create" defaultMessage="Create" />
                    ),
                    uri: '/u/account/commerce/checkout/create',
                    active: true,
                  },
                ]}
              />
              <div>
                {JSON.stringify(errors)}
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field
                      label={
                        <FormattedMessage id="name" defaultMessage="Name" />
                      }
                      component={TextField}
                      name="name"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      label={
                        <FormattedMessage id="title" defaultMessage="Title" />
                      }
                      component={TextField}
                      name="description"
                      fullWidth
                      multiline
                      rows={3}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormGroup row>
                      <FormControlLabel
                        control={
                          <Field
                            component={Checkbox}
                            type="checkbox"
                            name="requireEmail"
                          />
                        }
                        label="Require email"
                      />
                      <FormControlLabel
                        control={
                          <Field
                            component={Checkbox}
                            type="checkbox"
                            name="requireAccount"
                          />
                        }
                        label="Require account"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item xs={12}>
                    <CheckoutItemsTable name="items" />
                  </Grid>
                  <Grid item xs={12}>
                    <FieldArray
                      name="items"
                      render={({ handlePush }) => (
                        <Button
                          variant="outlined"
                          onClick={handlePush({
                            productId: '',
                            quantity: 1,
                          } as CheckoutItemType)}
                        >
                          <FormattedMessage
                            id="add.item"
                            defaultMessage="Add item"
                          />
                        </Button>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Box>
                      <Stack justifyContent="flex-end" direction="row">
                        <Button
                          onClick={submitForm}
                          disabled={!isValid || isSubmitting}
                          variant="contained"
                        >
                          <FormattedMessage
                            id="create"
                            defaultMessage="Create"
                          />
                        </Button>
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>
              </div>
            </Stack>
          </Container>
        )}
      </Formik>
    </>
  );
}

export default function CheckoutCreatePage() {
  return (
    <DashboardLayout page="checkout">
      <CreateCheckoutComponent />
    </DashboardLayout>
  );
}
