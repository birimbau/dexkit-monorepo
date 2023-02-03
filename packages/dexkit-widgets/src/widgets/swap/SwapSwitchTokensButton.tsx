import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { ButtonBase, ButtonBaseProps } from "@mui/material";

export interface SwapSwitchTokensButtonProps {
  ButtonBaseProps: ButtonBaseProps;
}

export default function SwapSwitchTokensButton({
  ButtonBaseProps,
}: SwapSwitchTokensButtonProps) {
  return (
    <ButtonBase
      {...ButtonBaseProps}
      sx={(theme) => ({
        backgroundColor: theme.palette.grey[300],
        borderRadius: theme.shape.borderRadius / 2,
        border: `solid ${theme.palette.common.white}`,
        borderWidth: theme.spacing(0.75),
        p: 1,
      })}
    >
      <ArrowDownwardIcon />
    </ButtonBase>
  );
}
