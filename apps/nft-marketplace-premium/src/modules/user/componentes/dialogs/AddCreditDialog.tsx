import { AppDialogTitle } from '@dexkit/ui';
import FormikDecimalInput from '@dexkit/ui/components/FormikDecimalInput';
import { useBuyCreditsCheckout } from '@dexkit/ui/hooks/payments';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
} from '@mui/material';
import Decimal from 'decimal.js';
import { Formik } from 'formik';
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

  const handleSubmit = async ({ amount }: { amount: string }) => {
    const result = await buyCreditsCheckout.mutateAsync({
      amount: parseFloat(amount),
    });

    window.open(result?.url, '_blank');
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
        initialValues={{ amount: '5' }}
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
              <FormikDecimalInput
                TextFieldProps={{
                  label: (
                    <FormattedMessage id="amount" defaultMessage="Amount" />
                  ),
                }}
                name="amount"
                decimals={2}
              />
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
