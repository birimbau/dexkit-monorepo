import {
  Avatar,
  AvatarGroup,
  ButtonBase,
  Stack,
  Typography,
  lighten,
} from "@mui/material";

import { TOKEN_ICON_URL } from "@dexkit/core";
import { Token } from "@dexkit/core/types";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export interface PairButtonProps {
  quoteToken: Token;
  baseToken: Token;
  onClick?: () => void;
}

export default function PairButton({
  quoteToken,
  baseToken,
  onClick,
}: PairButtonProps) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={(theme) => ({
        px: 1,
        py: 1,
        borderRadius: theme.spacing(0.5),
        backgroundColor: lighten(theme.palette.background.default, 0.2),
        borderWidth: 1,
        borderStyle: "solid",
        borderColor:
          theme.palette.mode === "light" ? theme.palette.divider : undefined,
      })}
    >
      <Stack
        spacing={1}
        alignItems="center"
        justifyContent="space-between"
        direction="row"
      >
        <Stack
          alignItems="center"
          justifyContent="space-between"
          direction="row"
          spacing={1}
        >
          <AvatarGroup>
            <Avatar
              src={TOKEN_ICON_URL(baseToken.contractAddress, baseToken.chainId)}
              sx={{ height: "1rem", width: "1rem" }}
            />
            <Avatar
              src={TOKEN_ICON_URL(
                quoteToken.contractAddress,
                quoteToken.chainId
              )}
              sx={{ height: "1rem", width: "1rem" }}
            />
          </AvatarGroup>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {baseToken.symbol.toUpperCase()} / {quoteToken.symbol.toUpperCase()}
          </Typography>
        </Stack>

        <ExpandMoreIcon color="primary" />
      </Stack>
    </ButtonBase>
  );
}
