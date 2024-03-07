import { AppDialogTitle } from '@dexkit/ui';
import FormikDecimalInput from '@dexkit/ui/components/FormikDecimalInput';
import {
  useBuyCreditsCheckout,
  useCryptoCheckout,
} from '@dexkit/ui/hooks/payments';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  MenuItem,
  Stack,
} from '@mui/material';
import Decimal from 'decimal.js';
import { Field, Formik } from 'formik';
import { Select } from 'formik-mui';
import { FormattedMessage, useIntl } from 'react-intl';

export interface AddCreditDialogProps {
  DialogProps: DialogProps;
}

export default function AddCreditDialog({ DialogProps }: AddCreditDialogProps) {
  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  const buyCreditsCheckout = useBuyCreditsCheckout();

  const cryptoCheckout = useCryptoCheckout();

  const handleSubmit = async ({
    amount,
    paymentMethod,
  }: {
    amount: string;
    paymentMethod: string;
  }) => {
    console.log('vem aqui', paymentMethod);
    if (paymentMethod === 'crypto') {
      const result = await cryptoCheckout.mutateAsync({
        amount,
        intent: 'credit-grant',
      });

      window.open(`/checkout/${result?.id}`);
    } else {
      const result = await buyCreditsCheckout.mutateAsync({
        amount: parseFloat(amount),
        paymentMethod,
      });

      window.open(result?.url, '_blank');
    }
  };

  const { formatMessage } = useIntl();

  const handleValitate = ({ amount }: any) => {
    const value = new Decimal(amount);

    if (value.lessThan(5)) {
      return { amount: formatMessage({ defaultMessage: 'the minimum is 5' }) };
    }

    if (value.greaterThan(95)) {
      return { amount: formatMessage({ defaultMessage: 'the maximum is 95' }) };
    }
  };

  return (
    <Dialog {...DialogProps}>
      <Formik
        initialValues={{ amount: '5', paymentMethod: 'crypto' }}
        onSubmit={handleSubmit}
        validate={handleValitate}
      >
        {({ submitForm, isValid, isSubmitting }) => (
          <>
            <AppDialogTitle
              onClose={handleClose}
              title={
                <FormattedMessage id="add.credit" defaultMessage="Add Credit" />
              }
            />
            <DialogContent dividers>
              <Stack spacing={2}>
                <FormikDecimalInput
                  TextFieldProps={{
                    label: (
                      <FormattedMessage id="amount" defaultMessage="Amount" />
                    ),
                  }}
                  name="amount"
                  decimals={2}
                />
                <Field
                  component={Select}
                  name="paymentMethod"
                  fullWidth
                  label={
                    <FormattedMessage
                      id="payment.method"
                      defaultMessage="Payment method"
                    />
                  }
                >
                  <MenuItem value="crypto">
                    <FormattedMessage
                      id="cryptocurrency"
                      defaultMessage="Cryptocurrency"
                    />
                  </MenuItem>
                  <MenuItem value="card">
                    <FormattedMessage
                      id="credit.card"
                      defaultMessage="Credit Card"
                    />
                  </MenuItem>
                </Field>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                disabled={isSubmitting || !isValid}
                onClick={submitForm}
              >
                <FormattedMessage id="add" defaultMessage="Add" />
              </Button>
              <Button onClick={handleClose} disabled={isSubmitting}>
                <FormattedMessage id="cancel" defaultMessage="Cancel" />
              </Button>
            </DialogActions>
          </>
        )}
      </Formik>
    </Dialog>
  );
}
