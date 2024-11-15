import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import useCommerce from "../../hooks/useCommerce";
import CartContentItem from "./CartContentItem";
import ContentHeader from "./ContentHeader";
import PaymentCard from "./PaymentCard";

export interface CartContentProps {
  disableHeader?: boolean;
}

export default function CartContent({ disableHeader }: CartContentProps) {
  const {
    cartItems,
    closeCart,
    checkCart,
    cart: { item, updateItem },
    productId,
  } = useCommerce();

  useEffect(() => {
    checkCart();
  }, []);

  const handleIncrement = (productId: string) => {
    return () => {
      const cartItem = item(productId ?? "");

      if (cartItem) {
        updateItem({ ...cartItem, quantity: cartItem.quantity + 1 });
      }
    };
  };

  const handleDecrement = (productId: string) => {
    return () => {
      const cartItem = item(productId ?? "");

      if (cartItem) {
        updateItem({ ...cartItem, quantity: cartItem.quantity - 1 });
      }
    };
  };

  return (
    <Box>
      <Grid container spacing={2}>
        {!disableHeader && (
          <Grid item xs={12}>
            <ContentHeader
              title={<FormattedMessage id="cart" defaultMessage="Cart" />}
              onBack={closeCart}
            />
          </Grid>
        )}

        <Grid item xs={12} sm={8}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <FormattedMessage id="product" defaultMessage="Product" />
                </TableCell>
                <TableCell>
                  <FormattedMessage id="price" defaultMessage="Price" />
                </TableCell>
                <TableCell>
                  <FormattedMessage id="quantity" defaultMessage="Quantity" />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cartItems.map((item, index) => (
                <CartContentItem
                  key={index}
                  item={item}
                  onIncrement={handleIncrement(item.productId)}
                  onDecrement={handleDecrement(item.productId)}
                />
              ))}
            </TableBody>
          </Table>
        </Grid>
        <Grid item xs={12} sm={4}>
          <PaymentCard />
        </Grid>
      </Grid>
    </Box>
  );
}
