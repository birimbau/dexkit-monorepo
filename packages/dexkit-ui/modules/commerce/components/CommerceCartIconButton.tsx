import ShoppingCart from "@mui/icons-material/ShoppingCartOutlined";
import { Badge, IconButton } from "@mui/material";
import useCommerce from "../hooks/useCommerce";

export interface CommerceCartIconButtonProps {}

export default function CommerceCartIconButton({}: CommerceCartIconButtonProps) {
  const { cartItems } = useCommerce();

  return (
    <IconButton>
      <Badge
        color="primary"
        content={cartItems.length > 0 ? cartItems.length.toString() : undefined}
      >
        <ShoppingCart />
      </Badge>
    </IconButton>
  );
}
