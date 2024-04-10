import { TransferUserEvent } from '@/modules/wizard/types/events';
import {
  getBlockExplorerUrl,
  getChainName,
  truncateAddress,
} from '@dexkit/core/utils';
import { Link, TableCell, TableRow } from '@mui/material';
import { FormattedMessage } from 'react-intl';

export interface TransferEventRowProps {
  event: TransferUserEvent;
}

export default function TransferEventRow({ event }: TransferEventRowProps) {
  return (
    <TableRow>
      <TableCell>{getChainName(event.chainId)}</TableCell>
      <TableCell>
        <Link
          target="_blank"
          href={`${getBlockExplorerUrl(event.chainId)}/address/${event.from}`}
        >
          {truncateAddress(event.from)}
        </Link>
      </TableCell>
      <TableCell>
        {event.amount} {event.token.symbol.toUpperCase()}
      </TableCell>
      <TableCell>
        <Link
          target="_blank"
          href={`${getBlockExplorerUrl(event.chainId)}/address/${event.to}`}
        >
          {truncateAddress(event.to)}
        </Link>
      </TableCell>
      <TableCell>
        <Link
          target="_blank"
          href={`${getBlockExplorerUrl(event.chainId)}/tx/${event.txHash}`}
        >
          <FormattedMessage id="view" defaultMessage="View" />
        </Link>
      </TableCell>
    </TableRow>
  );
}
