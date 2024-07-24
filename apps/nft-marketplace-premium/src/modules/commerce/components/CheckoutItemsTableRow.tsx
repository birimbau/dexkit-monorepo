import Visibility from '@mui/icons-material/Visibility';
import { IconButton, TableCell, TableRow } from '@mui/material';
import ProductAutocomplete from './ProductAutocomplete';

export interface CheckoutItemsTableRowProps {
  name: string;
}

export default function CheckoutItemsTableRow({
  name,
}: CheckoutItemsTableRowProps) {
  return (
    <TableRow>
      <TableCell>
        <ProductAutocomplete prefix={name} name="productId" />
      </TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell>
        <IconButton>
          <Visibility />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
