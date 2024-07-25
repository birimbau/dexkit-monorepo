import { Skeleton, TableCell, TableRow } from '@mui/material';
import Decimal from 'decimal.js';
import { Field, useField } from 'formik';
import { TextField } from 'formik-mui';
import { FormattedNumber } from 'react-intl';
import useProduct from '../hooks/useProduct';
import ProductAutocomplete from './ProductAutocomplete';

export interface CheckoutItemsTableRowProps {
  name: string;
}

export default function CheckoutItemsTableRow({
  name,
}: CheckoutItemsTableRowProps) {
  const [props, meta, helpers] = useField<string>(`${name}.productId`);
  const [propsQtd, metaQtd, helpersQtd] = useField<number | undefined>(
    `${name}.quantity`,
  );

  const { data: product, isLoading } = useProduct({ id: props.value });

  console.log(product);

  return (
    <TableRow>
      <TableCell>
        <ProductAutocomplete name={name} />
      </TableCell>
      <TableCell>
        <Field
          name={`${name}.quantity`}
          component={TextField}
          size="small"
          type="number"
        />
      </TableCell>
      <TableCell>
        {isLoading ? (
          <Skeleton />
        ) : (
          <FormattedNumber
            style="currency"
            minimumFractionDigits={2}
            maximumFractionDigits={2}
            currency="usd"
            value={new Decimal(product?.price ?? '0').toNumber()}
          />
        )}
      </TableCell>
      <TableCell>
        {isLoading ? (
          <Skeleton />
        ) : (
          propsQtd.value && (
            <FormattedNumber
              style="currency"
              minimumFractionDigits={2}
              maximumFractionDigits={2}
              currency="usd"
              value={new Decimal(product?.price ?? '0')
                .mul(parseInt(propsQtd.value?.toString() ?? '0').toString())
                .toNumber()}
            />
          )
        )}
      </TableCell>
    </TableRow>
  );
}
