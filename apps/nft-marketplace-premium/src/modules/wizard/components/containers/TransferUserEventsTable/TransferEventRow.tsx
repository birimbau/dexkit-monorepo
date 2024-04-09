import { SwapUserEvent } from '@/modules/wizard/types/events';
import { getBlockExplorerUrl } from '@dexkit/core/utils';
import { Link, TableCell, TableRow } from '@mui/material';
import { FormattedMessage } from 'react-intl';

export interface TransferEventRowProps {
  event: SwapUserEvent;
}

export default function TransferEventRow({ event }: TransferEventRowProps) {
  return (
    <TableRow>
      <TableCell>{event.chainId}</TableCell>
      <TableCell>{event.from}</TableCell>
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
