import { ProductCollectionType } from '@dexkit/ui/modules/commerce/types';
import { Grid } from '@mui/material';
import { useFormikContext } from 'formik';
import ProductCollectionFormProductsItem from './ProductCollectionFormProductsItem';

export interface ProductCollectionFormProductsProps {}

export default function ProductCollectionFormProducts({}: ProductCollectionFormProductsProps) {
  const { values } = useFormikContext<ProductCollectionType>();

  return (
    <Grid container spacing={2}>
      {values.items?.map((item, index) => (
        <Grid item xs={12} sm={3} key={index}>
          <ProductCollectionFormProductsItem
            key={index}
            name={`items.${index}`}
          />
        </Grid>
      ))}
      <Grid item xs={12}></Grid>
    </Grid>
  );
}
