import { isValidDecimal } from '@dexkit/core/utils';
import AppDataTable from '@dexkit/ui/components/AppDataTable';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
} from '@mui/material';
import { ethers } from 'ethers';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { AppDialogTitle } from 'src/components/AppDialogTitle';

export interface AirdropDialogProps {
  DialogProps: DialogProps;
  onConfirm: (data: { address: string; quantity: string }[]) => void;
  value: { address: string; quantity: string }[];
}

export default function AirdropDialog({
  DialogProps,
  onConfirm,
  value,
}: AirdropDialogProps) {
  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
    setValues(undefined);
  };

  const [values, setValues] =
    useState<{ address: string; quantity: string }[]>();

  const handleConfirm = () => {
    if (values) {
      onConfirm(values);
      handleClose();
    }
  };

  const handleChange = (data: { address: string; quantity: string }[]) => {
    setValues(data);
  };

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        title={<FormattedMessage id="airdrop" defaultMessage="Airdrop" />}
      />
      <DialogContent sx={{ p: 0 }} dividers>
        <AppDataTable
          dataColumns={[
            {
              headerName: 'Address',
              name: 'address',
              isValid: (value: unknown) => {
                return ethers.utils.isAddress(value as string);
              },
              editable: true,
            },
            {
              headerName: 'Quantity',
              name: 'quantity',
              isValid: (value: unknown) => {
                return isValidDecimal(value as string, 18);
              },
              editable: true,
            },
          ]}
          data={value}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirm} variant="contained">
          <FormattedMessage id="confirm" defaultMessage="Confirm" />
        </Button>
        <Button onClick={handleClose}>
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
