import { IconButton, Stack, Typography } from "@mui/material";
import React from "react";

export interface ShareDialogIconButtonProps {
  icon: React.ReactNode;
  title: React.ReactNode;
  onClick: () => void;
}

export default function ShareDialogIconButton({
  icon,
  title,
  onClick,
}: ShareDialogIconButtonProps) {
  return (
    <Stack>
      <IconButton onClick={onClick}>{icon}</IconButton>
      <Typography textAlign="center" variant="caption">
        {title}
      </Typography>
    </Stack>
  );
}
