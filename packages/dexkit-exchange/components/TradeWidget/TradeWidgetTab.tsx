import { Tab, lighten } from "@mui/material";
import { styled } from "@mui/material/styles";

export const TradeWidgetTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  borderRadius: theme.shape.borderRadius,
  "&.Mui-selected": {
    backgroundColor: lighten(theme.palette.background.default, 0.2),
  },
}));

export default TradeWidgetTab;
