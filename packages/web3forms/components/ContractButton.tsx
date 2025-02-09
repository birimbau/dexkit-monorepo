import { Avatar, Box, ButtonBase, Paper, Stack, Typography } from "@mui/material";
import React from "react";

export interface ContractButtonProps {
  title: React.ReactNode;
  description: React.ReactNode;
  creator: {
    imageUrl: string;
    name: string;
  };
  disabled?: boolean;
  onClick?: () => void;
}

export default function ContractButton({
  creator,
  description,
  title,
  disabled,
  onClick,
}: ContractButtonProps) {
  return (
    <ButtonBase disabled={disabled} onClick={onClick} sx={{ width: '100%', display: 'block' }}>
      <Paper
        sx={{
          p: 2,
          width: "100%",
          textAlign: "left",
          display: "block",
        }}
      >
        <Box sx={{ minHeight: "6rem" }}>
          <Typography gutterBottom variant="body1" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Box>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar src={creator.imageUrl} sx={{ height: "1rem", width: "1rem" }} />
          <Typography variant="caption">{creator.name}</Typography>
        </Stack>
      </Paper>
    </ButtonBase>
  );
}
