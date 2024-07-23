import FormikDecimalInput from '@dexkit/ui/components/FormikDecimalInput';
import { IconButton, TableCell, TableRow } from '@mui/material';

import DeleteIcon from '@mui/icons-material/DeleteOutline';
import { FormattedMessage } from 'react-intl';
import ProductNetworkAutocomplete from './ProductNetworkAutocomplete';
import ProductTokenAutocomplete from './ProductTokenAutocomplete';

export interface ProductPriceTableRowProps {
  namePrefix: string;
}

export default function ProductPriceTableRow({
  namePrefix,
}: ProductPriceTableRowProps) {
  return (
    <TableRow>
      <TableCell>
        <ProductNetworkAutocomplete name={`${namePrefix}.chainId`} />
      </TableCell>
      <TableCell>
        <ProductTokenAutocomplete name={`${namePrefix}.contractAddress`} />
      </TableCell>
      <TableCell>
        <FormikDecimalInput
          name={`${namePrefix}.amount`}
          TextFieldProps={{
            fullWidth: true,
            size: 'small',
            label: <FormattedMessage id="amount" defaultMessage="Amount" />,
          }}
          decimals={6}
        />
      </TableCell>
      <TableCell>
        <IconButton>
          <DeleteIcon color="error" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
