import {
  Avatar,
  ButtonBase,
  ButtonBaseProps,
  lighten,
  Stack,
  Typography,
} from "@mui/material";
import { memo } from "react";
import { FormattedMessage } from "react-intl";

import { TOKEN_ICON_URL } from "@dexkit/core/constants";
import { Token } from "@dexkit/core/types";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export interface SwapTokenButtonUniswapProps {
  token?: Token;
  ButtonBaseProps?: ButtonBaseProps;
}

function SwapTokenButtonUniswap({
  token,
  ButtonBaseProps,
}: SwapTokenButtonUniswapProps) {
  return (
    <ButtonBase
      {...ButtonBaseProps}
      sx={(theme) => ({
        borderRadius: theme.shape.borderRadius,
        px: 0.5,
        py: 0.5,
        backgroundColor: token
          ? theme.palette.background.default
          : theme.palette.primary.main,
        border: `1px solid ${
          theme.palette.mode === "dark"
            ? lighten(theme.palette.divider, 0.2)
            : theme.palette.divider
        }`,
      })}
    >
      {token ? (
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Avatar
            sx={(theme) => ({
              height: theme.spacing(3),
              width: theme.spacing(3),
            })}
            imgProps={{ sx: { objectFit: "fill" } }}
            src={
              token.logoURI
                ? token.logoURI
                : TOKEN_ICON_URL(token.address, token.chainId)
            }
          />

          <Typography fontWeight="bold" variant="body1">
            {token?.symbol.toUpperCase()}
          </Typography>
          <ExpandMoreIcon />
        </Stack>
      ) : (
        <Stack
          sx={{ px: 0.5 }}
          direction="row"
          alignItems="center"
          spacing={0.5}
        >
          <Typography
            sx={{
              color: (theme) =>
                theme.palette.getContrastText(theme.palette.primary.main),
            }}
            fontWeight="bold"
          >
            <FormattedMessage id="select.token" defaultMessage="Select token" />
          </Typography>
          <ExpandMoreIcon
            sx={{
              color: (theme) =>
                theme.palette.getContrastText(theme.palette.primary.main),
            }}
          />
        </Stack>
      )}
    </ButtonBase>
  );
}

export default memo(SwapTokenButtonUniswap);
