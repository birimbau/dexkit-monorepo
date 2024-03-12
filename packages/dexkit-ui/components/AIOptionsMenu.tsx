import { Menu, MenuItem, MenuProps } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { useRouter } from "next/router";

export interface AIOptionsMenuProps {
  MenuProps: MenuProps;
}

export default function AIOptionsMenu({ MenuProps }: AIOptionsMenuProps) {
  const router = useRouter();
  return (
    <Menu {...MenuProps}>
      <MenuItem onClick={() => router.push("/u/settings?section=billing")}>
        <FormattedMessage
          id="billing.and.usage"
          defaultMessage="Billing & Usage"
        />
      </MenuItem>
    </Menu>
  );
}
