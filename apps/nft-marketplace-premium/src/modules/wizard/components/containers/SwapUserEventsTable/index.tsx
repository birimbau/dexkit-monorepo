import { SwapUserEvent } from '@/modules/wizard/types/events';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';

import { FormattedMessage } from 'react-intl';
import SwapEventRow from './SwapEventRow';

export interface SwapUserEventsTableProps {
  events: SwapUserEvent[];
}

export default function SwapUserEventsTable({
  events,
}: SwapUserEventsTableProps) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            <FormattedMessage id="network" defaultMessage="Network" />
          </TableCell>
          <TableCell>
            <FormattedMessage id="from" defaultMessage="From" />
          </TableCell>
          <TableCell>
            <FormattedMessage id="amount.in" defaultMessage="Amount in" />
          </TableCell>
          <TableCell>
            <FormattedMessage id="amount.out" defaultMessage="Amount out" />
          </TableCell>
          <TableCell>
            <FormattedMessage id="actions" defaultMessage="Actions" />
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {events.map((e, index) => (
          <SwapEventRow event={e} key={index} />
        ))}
      </TableBody>
    </Table>
  );
}
