import { SwapUserEvent } from '@/modules/wizard/types/events';
import { getBlockExplorerUrl, truncateAddress } from '@dexkit/core/utils';
import { Link, TableCell, TableRow } from '@mui/material';
import { FormattedMessage } from 'react-intl';

export interface SwapEventRow {
  event: SwapUserEvent;
}

export default function SwapEventRow({ event }: SwapEventRow) {
  return (
    <TableRow>
      <TableCell>{event.chainId}</TableCell>
      <TableCell>
        <Link
          target="_blank"
          href={`${getBlockExplorerUrl(event.chainId)}/address/${event.from}`}
        >
          {truncateAddress(event.from)}
        </Link>
      </TableCell>
      <TableCell>
        {event.tokenInAmount} {event.tokenIn.symbol.toUpperCase()}
      </TableCell>
      <TableCell>
        {event.tokenOutAmount} {event.tokenOut.symbol.toUpperCase()}
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
