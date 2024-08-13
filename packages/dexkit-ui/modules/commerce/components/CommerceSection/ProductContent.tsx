import { Button, Grid, styled, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import useCommerce from "../../hooks/useCommerce";
import useUserProduct from "../../hooks/useUserProduct";

const Image = styled("img")((theme) => ({}));

export default function ProductContent() {
  const { productId } = useCommerce();

  const { data: product } = useUserProduct({ id: productId });

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Image src={product?.imageUrl ?? ""} sx={{ aspectRatio: "1/1" }} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography variant="h5" component="h1">
          {product?.name}
        </Typography>
        <Button variant="contained" color="primary">
          <FormattedMessage id="add.to.cart" defaultMessage="Add to cart" />
        </Button>
      </Grid>
    </Grid>
  );
}
