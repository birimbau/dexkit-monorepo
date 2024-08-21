import { ShoppingCart } from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  Skeleton,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import Decimal from "decimal.js";
import { useMemo } from "react";
import { FormattedMessage, FormattedNumber } from "react-intl";
import useCommerce from "../../hooks/useCommerce";
import useUserProduct from "../../hooks/useUserProduct";
import Counter from "../Counter";
import ContentHeader from "./ContentHeader";

const Image = styled("img")((theme) => ({
  height: "auto",
  width: "100%",
}));

export interface ProductContentProps {
  productId: string;
  disableHeader?: boolean;
}

export default function ProductContent({
  productId,
  disableHeader,
}: ProductContentProps) {
  const {
    openCart,
    setProduct,
    cart: { item, addItem, updateItem },
  } = useCommerce();

  const { data: product } = useUserProduct({ id: productId });

  console.log("product", product);

  const cartItem = useMemo(() => {
    return item(productId ?? "");
  }, [productId, item]);

  const handleIncrement = () => {
    if (!cartItem) {
      if (product) {
        addItem({
          name: product.name,
          price: product.price,
          productId: product.id,
          quantity: 1,
          imageUrl: product.imageUrl ?? undefined,
        });
      }
    }

    if (cartItem) {
      updateItem({ ...cartItem, quantity: cartItem.quantity + 1 });
    }
  };

  const handleDecrement = () => {
    if (cartItem) {
      updateItem({ ...cartItem, quantity: cartItem.quantity - 1 });
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addItem({
        name: product.name,
        price: product.price,
        productId: product.id,
        quantity: 1,
        imageUrl: product.imageUrl ?? undefined,
      });
    }
  };

  return (
    <Grid container spacing={2}>
      {!disableHeader && (
        <Grid item xs={12}>
          <ContentHeader
            title={product?.name ?? <Skeleton />}
            onBack={() => setProduct(undefined)}
          />
        </Grid>
      )}

      <Grid item xs={12} sm={6}>
        <Image src={product?.imageUrl ?? ""} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Box>
          <Stack spacing={2}>
            <Box>
              <Typography color="text.secondary" variant="caption">
                {product?.category?.name}
              </Typography>
              <Typography variant="h5" component="h1">
                {product?.name}
              </Typography>
              <Typography color="success.main" variant="subtitle1">
                <FormattedNumber
                  style="currency"
                  currency="usd"
                  value={new Decimal(
                    product?.price?.toString() ?? "0"
                  ).toNumber()}
                  maximumFractionDigits={18}
                  minimumFractionDigits={2}
                />
              </Typography>
            </Box>
            <Counter
              value={cartItem?.quantity ?? 0}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
            />

            {Boolean(cartItem) ? (
              <Button
                startIcon={<ShoppingCart />}
                onClick={openCart}
                fullWidth
                size="large"
                variant="outlined"
                color="primary"
              >
                <FormattedMessage id="go.to.cart" defaultMessage="Go to Cart" />
              </Button>
            ) : (
              <Button
                onClick={handleAddToCart}
                fullWidth
                size="large"
                variant="contained"
                color="primary"
              >
                <FormattedMessage
                  id="add.to.cart"
                  defaultMessage="Add to cart"
                />
              </Button>
            )}
          </Stack>
        </Box>
      </Grid>
    </Grid>
  );
}
