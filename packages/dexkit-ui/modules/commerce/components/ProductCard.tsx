import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Skeleton,
  Typography,
} from "@mui/material";
import Decimal from "decimal.js";
import { FormattedNumber } from "react-intl";
import useCommerce from "../hooks/useCommerce";
import { Product } from "../types";

import NextLink from "next/link";
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
    <Card variant="elevation">
      <CardActionArea LinkComponent={NextLink} onClick={handleClick} href={"/"}>
        {product.imageUrl ? (
          <CardMedia
            image={product.imageUrl}
            sx={{ aspectRatio: "1/1", height: "100%", width: "100%" }}
          />
        ) : (
          <Skeleton
            variant="rectangular"
            sx={{ aspectRatio: "1/1", height: "100%", width: "100%" }}
          />
        )}
        <CardContent>
          <Typography fontWeight="bold" variant="body1">
            {product.name}
          </Typography>
          <Typography variant="body2" color="success.main">
            <FormattedNumber
              style="currency"
              currency="usd"
              maximumFractionDigits={18}
              minimumFractionDigits={2}
              value={new Decimal(product.price).toNumber()}
            />
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
