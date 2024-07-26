import CheckoutForm from '@/modules/commerce/components/CheckoutForm';

const AddProductsDialog = dynamic(
  () => import('@/modules/commerce/components/dialogs/AddProductsDialog'),
);

import DashboardLayout from '@/modules/commerce/components/layout/DashboardLayout';
import useCreateCheckout from '@/modules/commerce/hooks/checkout/useCreateCheckout';
import { CheckoutSchema } from '@/modules/commerce/schemas';
import { CheckoutFormType } from '@/modules/commerce/types';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { Container, Stack } from '@mui/material';
import { Formik } from 'formik';
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
          requireAddress: false,
          title: '',
          description: '',
          items: [],
        }}
        onSubmit={handleSubmit}
        validationSchema={toFormikValidationSchema(CheckoutSchema)}
      >
        {({}) => (
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
                <CheckoutForm />
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
