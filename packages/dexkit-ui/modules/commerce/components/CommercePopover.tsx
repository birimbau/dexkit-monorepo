import { Popover, PopoverProps } from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useAuthUserQuery, useLogoutAccountMutation } from "../../../hooks";
import CommerceUserMenu from "./CommerceUserMenu";

export interface CommercePopoverProps {
  PopoverProps: PopoverProps;
  enableCommerce?: boolean;
}

export default function CommercePopover({
  PopoverProps,
  enableCommerce,
}: CommercePopoverProps) {
  const logoutMutation = useLogoutAccountMutation();

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const userQuery = useAuthUserQuery();
  const user = userQuery.data;

  console.log(userQuery.data);

  const handleAction = async ({ action }: { action: string }) => {
    try {
      if (action === "logout") {
        await logoutMutation.mutateAsync();
      }
      if (action === "wishlist") {
        router.push("/c/wishlist");
      }
      if (action === "profile" && user) {
        router.push(`/u/${user?.username}`);
      }
      if (action === "orders") {
        router.push("/c/orders");
      }
    } catch (err) {
      enqueueSnackbar(String(err), { variant: "error" });
    }
  };

  return (
    <Popover {...PopoverProps}>
      <CommerceUserMenu
        enableCommerce={enableCommerce}
        onAction={handleAction}
      />
    </Popover>
  );
}
