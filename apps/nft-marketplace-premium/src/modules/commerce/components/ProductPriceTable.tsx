import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import ProductPriceTableRow from './ProductPriceTableRow';

export interface ProductPriceTableProps {}

export default function ProductPriceTable({}: ProductPriceTableProps) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            <FormattedMessage id="network" defaultMessage="Network" />
          </TableCell>
          <TableCell>
            <FormattedMessage id="token" defaultMessage="Token" />
          </TableCell>
          <TableCell>
            <FormattedMessage id="amount" defaultMessage="Amount" />
          </TableCell>
          <TableCell>
            <FormattedMessage id="actions" defaultMessage="Actions" />
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <ProductPriceTableRow namePrefix="prices.0" />
        <ProductPriceTableRow namePrefix="prices.1" />
        <ProductPriceTableRow namePrefix="prices.2" />
      </TableBody>
    </Table>
  );
}
