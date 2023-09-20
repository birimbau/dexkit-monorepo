import { Tab, darken, lighten } from "@mui/material";
import { styled } from "@mui/material/styles";

export const TradeWidgetTabAlt = styled(Tab)(({ theme }) => ({
  "&.Mui-selected": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? lighten(theme.palette.background.default, 0.2)
        : darken(theme.palette.background.default, 0.05),
  },
}));

export default TradeWidgetTabAlt;
