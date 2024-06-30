import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { darken, IconButton, IconButtonProps } from "@mui/material";

export interface SwapSwitchMatchaButtonProps {
  IconButtonProps: IconButtonProps;
}

export default function SwapSwitchTokensMatchaButton({
  IconButtonProps,
}: SwapSwitchMatchaButtonProps) {
  return (
    <IconButton
      {...IconButtonProps}
      sx={(theme) => ({
        borderRadius: "50%",
        backgroundColor: "background.paper",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor:
          theme.palette.mode === "dark"
            ? theme.palette.background.default
            : theme.palette.divider,
        "&:hover": {
          backgroundColor: darken(theme.palette.background.paper, 0.15),
        },
        fontSize: "1rem",
      })}
    >
      <ArrowDownwardIcon fontSize="inherit" />
    </IconButton>
  );
}
