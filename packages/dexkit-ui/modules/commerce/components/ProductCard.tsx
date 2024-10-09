import {
  Box,
  Button,
  Card,
  Chip,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import Decimal from "decimal.js";
import { FormattedMessage, FormattedNumber } from "react-intl";
import useCommerce from "../hooks/useCommerce";
import { Product } from "../types";

import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import Share from "@mui/icons-material/Share";
import { MouseEvent } from "react";

export interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isSection, setProduct } = useCommerce();

  const handleClick = (e: MouseEvent) => {
    if (isSection) {
      e.preventDefault();
      setProduct(product.id);
    }
  };

  return (
    <Card variant="elevation" elevation={0}>
      <Stack spacing={1}>
        <Stack direction="row" justifyContent="flex-end">
          <IconButton size="small">
            <FavoriteBorderIcon fontSize="small" />
          </IconButton>
          <IconButton size="small">
            <Share fontSize="small" />
          </IconButton>
        </Stack>
        {product.imageUrl ? (
          <Box
            sx={{
              aspectRatio: "1/1",
              height: "100%",
              width: "100%",
              backgroundRepeat: "no-repeat",
              objectFit: "cover",
              backgroundSize: "contain",
              backgroundPosition: "center center",
              backgroundImage: `url("${product.imageUrl}")`,
              borderRadius: (theme) => theme.shape.borderRadius,
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          />
        ) : (
          <Skeleton
            variant="rectangular"
            sx={{ aspectRatio: "1/1", height: "100%", width: "100%" }}
          />
        )}
        <Stack alignItems="flex-start" spacing={2}>
          <Stack spacing={2} alignItems="center" direction="row">
            <Typography fontWeight="bold" variant="body1">
              {product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <FormattedNumber
                maximumFractionDigits={18}
                minimumFractionDigits={2}
                value={new Decimal(product.price).toNumber()}
              />{" "}
              USD
            </Typography>
          </Stack>
          <Chip size="small" color="primary" label={product.category?.name} />
          <Button
            onClick={handleClick}
            size="small"
            variant="contained"
            color="primary"
            endIcon={<AddShoppingCartIcon />}
          >
            <FormattedMessage id="buy.now" defaultMessage="Buy now" />
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
