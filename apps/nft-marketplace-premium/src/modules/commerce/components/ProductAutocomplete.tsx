import { useDebounce } from '@dexkit/core';
import {
  Autocomplete,
  Avatar,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
} from '@mui/material';
import { useField } from 'formik';
import { ChangeEvent, useEffect, useState } from 'react';
import useProduct from '../hooks/useProduct';
import useProductList from '../hooks/useProductList';
import { ProductPriceType } from '../types';

export interface ProductAutocompleteProps {
  name: string;
  prefix: string;
}

export default function ProductAutocomplete({
  name,
  prefix,
}: ProductAutocompleteProps) {
  const [props, meta, helpers] = useField<ProductPriceType>(prefix);
  const [propsField, metaField, helpersField] = useField<string>(name);

  const { data: products, mutateAsync: fetchProducts } = useProductList();

  const [query, setQuery] = useState('');

  const lazyQuery = useDebounce(query, 500);

  useEffect(() => {
    if (lazyQuery !== '') {
      fetchProducts({ page: 1, limit: 10 });
    }
  }, [lazyQuery]);

  const { data: product } = useProduct({ id: props.value.id });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <Autocomplete
      options={products?.items ?? []}
      value={product}
      sx={{ minWidth: { sm: '300px' } }}
      getOptionLabel={(t) => t.name}
      onChange={(e, value, reason) => {
        helpersField.setValue(value?.id ?? '');
      }}
      fullWidth
      renderOption={(params, opt) => (
        <ListItem {...params}>
          <ListItemIcon>
            <Avatar sx={{ width: '1rem', height: '1rem' }} variant="rounded" />
          </ListItemIcon>
          <ListItemText primary={opt.name} />
        </ListItem>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          fullWidth
          error={Boolean(metaField.error)}
          helperText={metaField.error?.toString() ?? undefined}
          value={query}
          onChange={handleChange}
        />
      )}
    />
  );
}
