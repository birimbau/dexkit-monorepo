import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  lighten,
} from "@mui/material";

import { FormattedMessage } from "react-intl";

export interface TradeWidgetProps {}

export default function TradeWidget({}: TradeWidgetProps) {
  return (
    <Card>
      <CardHeader
        title={<FormattedMessage id="trade" defaultMessage="Trade" />}
        titleTypographyProps={{ variant: "body1" }}
      />
      <Divider />
      <CardContent>
        <Stack spacing={2}>
          <Tabs
            value="1"
            variant="fullWidth"
            sx={{
              backgroundColor: (theme) =>
                lighten(theme.palette.background.default, 0.1),
              p: 1,
              "& .MuiTabs-indicator": { display: "none" },
              borderRadius: (theme) => theme.shape.borderRadius / 3,
            }}
          >
            <Tab
              value="1"
              sx={{
                textTransform: "none",
                borderRadius: (theme) => theme.shape.borderRadius / 2,
                "&.Mui-selected": {
                  backgroundColor: (theme) =>
                    lighten(theme.palette.background.default, 0.2),
                },
              }}
              label={<FormattedMessage id="market" defaultMessage="Market" />}
            />
            <Tab
              sx={{ textTransform: "none" }}
              label={<FormattedMessage id="limit" defaultMessage="Limit" />}
            />
          </Tabs>

          <Paper
            elevation={0}
            sx={{
              p: 2,
              backgroundColor: (theme) =>
                lighten(theme.palette.background.default, 0.1),
            }}
          >
            <Typography>Trade</Typography>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 2,
              backgroundColor: (theme) =>
                lighten(theme.palette.background.default, 0.1),
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography>
                <FormattedMessage
                  id="available.balance"
                  defaultMessage="Available balance"
                />
              </Typography>

              <Typography>3.5 ETH</Typography>
            </Stack>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 2,
              backgroundColor: (theme) =>
                lighten(theme.palette.background.default, 0.1),
            }}
          >
            <Stack spacing={2}>
              <TextField fullWidth />
              <TextField fullWidth />
              <TextField fullWidth />
            </Stack>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 2,
              backgroundColor: (theme) =>
                lighten(theme.palette.background.default, 0.1),
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography>
                <FormattedMessage
                  id="available.balance"
                  defaultMessage="Available balance"
                />
              </Typography>

              <Typography>3.5 ETH</Typography>
            </Stack>
          </Paper>
          <Button fullWidth variant="contained">
            <FormattedMessage id="buy.dai" defaultMessage="Buy dai" />
          </Button>
          <Button fullWidth>
            <FormattedMessage id="buy.dai" defaultMessage="Buy dai" />
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
