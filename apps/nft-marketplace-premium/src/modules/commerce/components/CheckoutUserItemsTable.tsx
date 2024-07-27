import { Token } from '@dexkit/core/types';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import Decimal from 'decimal.js';
import { CheckoutItem } from '../types';

export interface CheckoutUserItemListProps {
  token?: Token | null;
  items: CheckoutItem[];
}

export default function CheckoutUserItemList({
  token,
  items,
}: CheckoutUserItemListProps) {
  return (
    <List disablePadding>
      {items?.map((item: CheckoutItem, index: number) => (
        <ListItem divider key={index}>
          <ListItemText
            primary={item.description}
            secondary={`x${item.quantity}`}
          />
          <Typography>
            {new Decimal(item.quantity).mul(item.price).toString()}{' '}
            {token?.symbol ? token?.symbol : 'USD'}
          </Typography>
        </ListItem>
      ))}
    </List>
  );
}
