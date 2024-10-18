import React from "react";

import { Popover, PopoverProps } from "@mui/material";
import CommerceUserMenu from "./CommerceUserMenu";

export interface CommercePopoverProps {
  PopoverProps: PopoverProps;
}

export default function CommercePopover({
  PopoverProps,
}: CommercePopoverProps) {
  return (
    <Popover {...PopoverProps}>
      <CommerceUserMenu />
    </Popover>
  );
}
