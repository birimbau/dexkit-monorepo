import { useDexKitContext } from '@dexkit/ui/hooks';
import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { TransactionsTableRow } from './TransactionsTableRow';

export enum TransactionsTableFilter {
  Transactions,
  Trades,
}

export function TransactionsTable({
  filter,
}: {
  filter: TransactionsTableFilter;
}) {
  const { notifications } = useDexKitContext();

  const filteredNotifications = useMemo(() => {
    if (filter === TransactionsTableFilter.Trades) {
      return notifications.filter((n) => n.subtype === 'swap');
    }

    return notifications.filter((n) => n.subtype !== 'swap');
  }, [notifications, filter]);

  const renderTransactionsList = () => {
    if (filteredNotifications.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5}>
            <Stack sx={{ py: 2 }} alignItems="center" justifyContent="center">
              <Typography variant="body1" color="textSecondary">
                <FormattedMessage
                  id="nothing.to.see.here"
                  defaultMessage="Nothing to see here"
                />
              </Typography>
            </Stack>
          </TableCell>
        </TableRow>
      );
    }

    if (filteredNotifications.length > 0) {
      return filteredNotifications.map((notification, key) => (
        <TransactionsTableRow key={key} notification={notification} />
      ));
    }
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell colSpan={2}>
              <FormattedMessage id="transaction" defaultMessage="Transaction" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="date" defaultMessage="Date" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="status" defaultMessage="Status" />
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{renderTransactionsList()}</TableBody>
      </Table>
    </TableContainer>
  );
}
