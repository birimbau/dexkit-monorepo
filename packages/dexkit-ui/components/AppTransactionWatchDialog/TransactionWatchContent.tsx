import { getBlockExplorerUrl } from "@dexkit/core/utils";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Icon,
  Stack,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useWeb3React } from "@web3-react/core";
import { FormattedMessage } from "react-intl";
import { useWaitTransactionConfirmation } from "../../hooks";

export interface TransactionWatchContentProps {
  transaction: {
    icon: string;
    title: { id: string; defaultMessage: string };
    action: () => Promise<string>;
    params?: any;
  };
}

export default function TransactionWatchContent({
  transaction,
}: TransactionWatchContentProps) {
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
    <Box p={2}>
      <Stack spacing={2}>
        <Stack spacing={2} justifyContent="center" alignItems="center">
          <Avatar>
            {action.isLoading || waitTxQuery.isFetching ? (
              <CircularProgress />
            ) : waitTxQuery.isSuccess ? (
              <Icon>check</Icon>
            ) : (
              <Icon>{transaction.icon}</Icon>
            )}
          </Avatar>
          <Typography variant="h5">
            <FormattedMessage
              id={transaction.title.id}
              defaultMessage={transaction.title.defaultMessage}
            />
          </Typography>
        </Stack>
        {!waitTxQuery.isSuccess && (
          <Button
            fullWidth
            disabled={action.isLoading || waitTxQuery.isFetching}
            onClick={handleExecute}
            variant="contained"
          >
            {action.isError ? (
              <FormattedMessage id="try.again" defaultMessage="Try again" />
            ) : (
              <FormattedMessage id="execute" defaultMessage="Execute" />
            )}
          </Button>
        )}
        {action.data && waitTxQuery.isError ? (
          <Typography>
            <FormattedMessage
              id="transaction.failed"
              defaultMessage="Transaction failed"
            />
          </Typography>
        ) : undefined}

        {action.data && (
          <Button
            variant="outlined"
            href={`${getBlockExplorerUrl(chainId)}/tx/${action.data}`}
            target="_blank"
          >
            <FormattedMessage
              id="view.transaction"
              defaultMessage="View transaction"
            />
          </Button>
        )}
      </Stack>
    </Box>
  );
}
