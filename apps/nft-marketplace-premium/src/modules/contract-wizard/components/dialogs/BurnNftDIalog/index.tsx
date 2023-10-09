import { AppDialogTitle } from '@dexkit/ui/components';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
} from '@mui/material';
import { useContract } from '@thirdweb-dev/react';
import { Field, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { FormattedMessage } from 'react-intl';

export interface BurnTokenDialogProps {
  DialogProps: DialogProps;
  contractAddress: string;
}

export default function BurnTokenDialog({
  DialogProps,
  contractAddress,
}: BurnTokenDialogProps) {
  const { onClose } = DialogProps;

  const contract = useContract(contractAddress, 'token');

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  const handleSubmit = async ({ amount }: { amount: string }) => {
    await contract.data?.erc20.burn(amount);
  };

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        title={<FormattedMessage id="burn.token" defaultMessage="Burn Token" />}
        onClose={handleClose}
      />
      <Formik initialValues={{ amount: '0.0' }} onSubmit={handleSubmit}>
        {({ submitForm, isSubmitting }) => (
          <>
            <DialogContent dividers>
              <Field
                component={TextField}
                name="amount"
                fullWidth
                label={<FormattedMessage id="amount" defaultMessage="amount" />}
              />
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                disabled={isSubmitting}
                onClick={submitForm}
              >
                <FormattedMessage id="burn" defaultMessage="Burn" />
              </Button>
              <Button disabled={isSubmitting} onClick={handleClose}>
                <FormattedMessage id="cancel" defaultMessage="Cancel" />
              </Button>
            </DialogActions>
          </>
        )}
      </Formik>
    </Dialog>
  );
}
