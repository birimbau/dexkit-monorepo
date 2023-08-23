import { Divider, List } from "@mui/material";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { FormattedMessage } from "react-intl";
import { TxDialogTransaction } from "../../types";
import { AppDialogTitle } from "../AppDialogTitle";
import TransactionWatchContent from "./TransactionWatchContent";
import TransactionWatchItem from "./TransactionWatchItem";

export interface AppTransactionWatchDialogProps {
  DialogProps: DialogProps;
  transactions: TxDialogTransaction[];
}

export default function AppTransactionWatchDialog({
  DialogProps,
  transactions,
}: AppTransactionWatchDialogProps) {
  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="execute.transaction"
            defaultMessage="Execute transaction"
          />
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent sx={{ p: 0 }}>
        {transactions.length > 1 ? (
          <List disablePadding>
            {transactions.map((tx, index) => (
              <TransactionWatchItem transaction={tx} key={index} />
            ))}
          </List>
        ) : (
          <TransactionWatchContent transaction={transactions[0]} />
        )}
      </DialogContent>
    </Dialog>
  );
}
