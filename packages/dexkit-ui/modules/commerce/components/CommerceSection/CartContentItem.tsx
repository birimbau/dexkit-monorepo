import Inventory from "@mui/icons-material/Inventory";
import { Avatar, Stack, TableCell, TableRow, Typography } from "@mui/material";
import { CartItem } from "../../types";
import Counter from "../Counter";

export interface CartContentItemProps {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
}

export default function CartContentItem({
  item,
  onIncrement,
  onDecrement,
}: CartContentItemProps) {
  return (
    <TableRow>
      <TableCell>
        <Stack spacing={2} direction="row" alignItems="center">
          <Avatar src={item.imageUrl} variant="rounded">
            <Inventory />
          </Avatar>
          <Typography variant="inherit">{item.name}</Typography>
        </Stack>
      </TableCell>
      <TableCell>{item.price}</TableCell>
      <TableCell>
        <Counter
          value={item?.quantity ?? 0}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
        />
      </TableCell>
    </TableRow>
  );
}
