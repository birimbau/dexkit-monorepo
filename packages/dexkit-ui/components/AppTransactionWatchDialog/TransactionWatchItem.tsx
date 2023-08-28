import { getBlockExplorerUrl } from "@dexkit/core/utils";
import {
  Avatar,
  Button,
  CircularProgress,
  Icon,
  Link,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useWeb3React } from "@web3-react/core";
import { FormattedMessage } from "react-intl";
import { useWaitTransactionConfirmation } from "../../hooks";
import { TxDialogTransaction } from "../../types";

export interface TransactionWatchItemProps {
  transaction: TxDialogTransaction;
}

export default function TransactionWatchItem({
  transaction,
}: TransactionWatchItemProps) {
  const { provider, chainId } = useWeb3React();

  const action = useMutation(transaction.action);

  const waitTxQuery = useWaitTransactionConfirmation({
    provider,
    transactionHash: action.data,
  });

  const handleExecute = async () => {
    await action.mutateAsync(transaction.params);
  };

  return (
    <ListItem divider>
      <ListItemAvatar>
        <Avatar>
          {action.isLoading || waitTxQuery.isFetching ? (
            <CircularProgress />
          ) : waitTxQuery.isSuccess ? (
            <Icon>check</Icon>
          ) : (
            <Icon>{transaction.icon}</Icon>
          )}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <FormattedMessage
            id={transaction.title.id}
            defaultMessage={transaction.title.defaultMessage}
          />
        }
        secondary={
          action.data ? (
            waitTxQuery.isError ? (
              <FormattedMessage
                id="transaction.failed"
                defaultMessage="Transaction failed"
              />
            ) : (
              <Link
                href={`${getBlockExplorerUrl(chainId)}/tx/${action.data}`}
                target="_blank"
              >
                <FormattedMessage
                  id="view.transaction"
                  defaultMessage="View transaction"
                />
              </Link>
            )
          ) : undefined
        }
      />
      {!waitTxQuery.isSuccess && (
        <ListItemSecondaryAction>
          <Button
            size="small"
            disabled={action.isLoading || waitTxQuery.isFetching}
            onClick={handleExecute}
            variant="outlined"
          >
            {action.isError ? (
              <FormattedMessage id="try.again" defaultMessage="Try again" />
            ) : (
              <FormattedMessage id="execute" defaultMessage="Execute" />
            )}
          </Button>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
}
