import { Tabs, lighten, styled } from "@mui/material";

export const TradeWidgetTabs = styled(Tabs)(({ theme }) => ({
  backgroundColor: lighten(theme.palette.background.default, 0.1),
  padding: theme.spacing(1),
  "& .MuiTabs-indicator": { display: "none" },
  borderRadius: theme.shape.borderRadius,
}));

export default TradeWidgetTabs;
