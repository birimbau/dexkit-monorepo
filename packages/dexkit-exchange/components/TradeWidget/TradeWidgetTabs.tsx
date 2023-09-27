import { Tabs, lighten, styled } from "@mui/material";

export const TradeWidgetTabs = styled(Tabs)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? lighten(theme.palette.background.paper, 0.1)
      : theme.palette.background.default,
  padding: theme.spacing(1),
  "& .MuiTabs-indicator": { display: "none" },
  borderRadius: theme.shape.borderRadius,
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: theme.palette.mode === "light" ? theme.palette.divider : "none",
}));

export default TradeWidgetTabs;
