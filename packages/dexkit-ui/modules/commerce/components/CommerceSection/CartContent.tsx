import Inventory from "@mui/icons-material/Inventory";
import {
  Avatar,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { FormattedMessage } from "react-intl";
import useCommerce from "../../hooks/useCommerce";
import ContentHeader from "./ContentHeader";
import PaymentCard from "./PaymentCard";

export interface CartContentProps {}

export default function CartContent() {
  const { cartItems, closeCart } = useCommerce();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <ContentHeader
          title={<FormattedMessage id="cart" defaultMessage="Cart" />}
          onBack={closeCart}
        />
      </Grid>
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
              <TableRow key={index}>
                <TableCell>
                  <Stack spacing={2} direction="row" alignItems="center">
                    <Avatar src={item.imageUrl} variant="rounded">
                      <Inventory />
                    </Avatar>
                    <Typography variant="inherit">{item.name}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>{item.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Grid>
      <Grid item xs={12} sm={4}>
        <PaymentCard />
      </Grid>
    </Grid>
  );
}
