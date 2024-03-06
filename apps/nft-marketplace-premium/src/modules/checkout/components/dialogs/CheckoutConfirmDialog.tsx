import { Token } from '@dexkit/core/types';
import { getBlockExplorerUrl } from '@dexkit/core/utils';
import { AppDialogTitle } from '@dexkit/ui';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Stack,
  Typography,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';

export interface CheckoutConfirmDialogProps {
  token: Token | null;
  txHash?: string;
  isLoading?: boolean;
  DialogProps: DialogProps;
  onConfirm: () => void;
}

export default function CheckoutConfirmDialog({
  token,
  txHash,
  isLoading,
  DialogProps,
  onConfirm,
}: CheckoutConfirmDialogProps) {
  const renderContent = () => {
    if (isLoading) {
      return (
        <Stack spacing={2} justifyContent="center" alignItems="center">
          <CircularProgress color="primary" size="2.5rem" />

          <Typography align="center" variant="body1">
            <FormattedMessage
              id="transfer.amount.symbol"
              defaultMessage="Transfer {amount} {symbol}"
              values={{ amount: 33.3, symbol: 'USDC' }}
            />
          </Typography>
        </Stack>
      );
    }

    return (
      <Stack spacing={2} justifyContent="center" alignItems="center">
        <Typography align="center" variant="body1">
          <FormattedMessage
            id="transfer.amount.symbol"
            defaultMessage="Transfer {amount} {symbol}"
            values={{ amount: 33.3, symbol: token?.symbol }}
          />
        </Typography>
      </Stack>
    );
  };

  const renderTransaction = (hash: string) => {
    return (
      <Button
        href={`${getBlockExplorerUrl(token?.chainId)}/tx/${hash}`}
        target="_blank"
        variant="outlined"
      >
        <FormattedMessage
          id="view.transaction"
          defaultMessage="View transaction"
        />
      </Button>
    );
  };

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="confirm.transaction"
            defaultMessage="Confirm transaction"
          />
        }
      />
      <DialogContent dividers>
        <Stack spacing={2}>
          {renderContent()}
          {txHash && renderTransaction(txHash)}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm} variant="contained">
          <FormattedMessage id="confirm" defaultMessage="Confirm" />
        </Button>
        <Button>
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
