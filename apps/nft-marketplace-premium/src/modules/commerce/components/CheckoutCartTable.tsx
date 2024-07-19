import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { useFormikContext } from 'formik';
import { FormattedMessage } from 'react-intl';
import useCartState, { Action } from '../hooks/useCartState';
import CheckoutCartTableRow from './CheckoutCartTableRow';

export interface CheckoutCartTableProps {
  name: string;
}

export default function CheckoutCartTable({ name }: CheckoutCartTableProps) {
  const { setFieldValue } = useFormikContext();

  const handleCartAction = async (
    action: Action,
    next: (action: Action) => void,
  ) => {
    next(action);
  };

  const { items, addItem, removeItem, setItemAmount } = useCartState({
    onAction: handleCartAction,
  });

  const handleItemAction = (
    productId: string,
    action: string,
    amount: number,
    price: number,
  ) => {
    if (action === 'add') {
      addItem({ productId, amount: amount, price });
    }

    if (action === 'remove') {
      removeItem({ productId, amount: amount });
    }

    if (action === 'set') {
      setItemAmount({ productId, amount: amount });
    }
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            <FormattedMessage id="product" defaultMessage="Product" />
          </TableCell>

          <TableCell>
            <FormattedMessage id="un.price" defaultMessage="Un. price" />
          </TableCell>
          <TableCell>
            <FormattedMessage id="quantity" defaultMessage="Quantity" />
          </TableCell>
          <TableCell>
            <FormattedMessage id="total" defaultMessage="Total" />
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map((item, index) => (
          <CheckoutCartTableRow
            item={item}
            key={index}
            onAction={handleItemAction}
          />
        ))}
      </TableBody>
    </Table>
  );
}
