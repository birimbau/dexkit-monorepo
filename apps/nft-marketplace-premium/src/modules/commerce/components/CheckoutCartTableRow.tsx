import { TableCell, TableRow } from '@mui/material';
import Decimal from 'decimal.js';
import { useCallback } from 'react';
import { FormattedNumber } from 'react-intl';
import { CartItem } from '../hooks/useCartState';
import Counter from './Counter';

export interface CheckoutCartTableItemProps {
  item: CartItem;
  onAction: (
    productId: string,
    action: string,
    amount: number,
    price: number,
  ) => void;
}

export default function CheckoutCartTableItem({
  item,
  onAction,
}: CheckoutCartTableItemProps) {
  const handleAction = useCallback(
    ({ amount, action }: { amount: number; action: string }) => {
      onAction(item.productId, action, amount, item.price);
    },
    [onAction],
  );

  return (
    <TableRow>
      <TableCell>{item.description}</TableCell>
      <TableCell>
        <FormattedNumber
          value={new Decimal(item.price).div(100).toNumber()}
          currency="usd"
          currencySign="standard"
          compactDisplay="short"
          style="currency"
          maximumFractionDigits={2}
        />
      </TableCell>
      <TableCell>
        <Counter amount={item.quantity} limit={10} onAction={handleAction} />
      </TableCell>
      <TableCell>
        <FormattedNumber
          value={new Decimal(item.quantity * item.price).div(100).toNumber()}
          currency="usd"
          currencySign="standard"
          compactDisplay="short"
          style="currency"
          maximumFractionDigits={2}
        />
      </TableCell>
    </TableRow>
  );
}
