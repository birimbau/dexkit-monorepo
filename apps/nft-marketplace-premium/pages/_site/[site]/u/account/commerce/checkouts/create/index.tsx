import CheckoutCartTable from '@/modules/commerce/components/CheckoutCartTable';
import { Product } from '@/modules/commerce/components/dialogs/AddProductsDialog';

const AddProductsDialog = dynamic(
  () => import('@/modules/commerce/components/dialogs/AddProductsDialog'),
);

import DashboardLayout from '@/modules/commerce/components/layout/DashboardLayout';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import {
  Button,
  Container,
  FormControlLabel,
  FormGroup,
  Grid,
  Stack,
} from '@mui/material';
import { Field, Formik } from 'formik';
import { Checkbox, TextField } from 'formik-mui';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

export default function CreateCheckoutPage() {
  const handleSubmit = async () => {};

  const [showAddProducts, setShowAddProducts] = useState(false);

  const handleAddProducts = () => {
    setShowAddProducts(true);
  };

  const handleCloseAddProducts = () => {
    setShowAddProducts(false);
  };

  const handleConfirm = (product: Product[]) => {};

  return (
    <>
      {showAddProducts && (
        <AddProductsDialog
          DialogProps={{
            open: showAddProducts,
            onClose: handleCloseAddProducts,
          }}
          defaultSelection={[]}
          products={[
            { id: '372834', name: 'Camiseta X', price: 3050 },
            { id: '37283444434', name: 'Camiseta X', price: 43050 },
          ]}
          onConfirm={handleConfirm}
        />
      )}
      <DashboardLayout page="checkout">
        <Container>
          <Stack spacing={2}>
            <PageHeader
              breadcrumbs={[
                {
                  caption: (
                    <FormattedMessage id="commerce" defaultMessage="Commerce" />
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
                  uri: '/u/account/commerce/orders',
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
              <Formik
                initialValues={{
                  title: '',
                  requireEmail: false,
                  requireAccount: false,
                }}
                onSubmit={handleSubmit}
              >
                {({ submitForm, isSubmitting, isValid }) => (
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Field
                        label={
                          <FormattedMessage id="title" defaultMessage="Title" />
                        }
                        component={TextField}
                        name="title"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormGroup row>
                        <FormControlLabel
                          control={
                            <Field component={Checkbox} name="requireEmail" />
                          }
                          label="Require email"
                        />
                        <FormControlLabel
                          control={
                            <Field component={Checkbox} name="requireAccount" />
                          }
                          label="Require account"
                        />
                      </FormGroup>
                    </Grid>
                    <Grid item xs={12}>
                      <CheckoutCartTable name="items" />
                    </Grid>
                    <Grid item xs={12}>
                      <Button onClick={handleAddProducts} variant="outlined">
                        <FormattedMessage
                          id="add.products"
                          defaultMessage="Add products"
                        />
                      </Button>
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
            </div>
          </Stack>
        </Container>
      </DashboardLayout>
    </>
  );
}
