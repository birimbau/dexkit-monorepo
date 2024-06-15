import type { TokenBalances } from "@indexed-finance/multicall";
import {
  Avatar,
  Box,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { BigNumber, constants } from "ethers";
import { memo } from "react";

import { TOKEN_ICON_URL } from "@dexkit/core/constants";
import { Token } from "@dexkit/core/types";
import { formatBigNumber } from "@dexkit/core/utils";
import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "@dexkit/ui/modules/swap/constants";

export interface SelectCoinListUniswapItemProps {
  token: Token;
  onSelect: (token: Token) => void;
  tokenBalances?: TokenBalances | null;
  isLoading: boolean;
}

function SelectCoinListUniswapItem({
  token,
  onSelect,
  tokenBalances,
  isLoading,
}: SelectCoinListUniswapItemProps) {
  const balance = tokenBalances
    ? tokenBalances[
        token?.address.toLowerCase() ===
        ZEROEX_NATIVE_TOKEN_ADDRESS.toLowerCase()
          ? constants.AddressZero
          : token.address
      ]
    : BigNumber.from(0);

  return (
    <ListItemButton onClick={() => onSelect(token)}>
      <ListItemAvatar>
        <Stack alignItems="center" justifyContent="center">
          <Avatar
            src={
              token.logoURI
                ? token.logoURI
                : TOKEN_ICON_URL(token.address, token.chainId)
            }
            imgProps={{ sx: { objectFit: "fill" } }}
            sx={{ height: "1.5rem", width: "1.5rem" }}
          />
        </Stack>
      </ListItemAvatar>
      <ListItemText
        primary={token.symbol.toUpperCase()}
        secondary={token.name}
        primaryTypographyProps={{ variant: "body2" }}
        secondaryTypographyProps={{ variant: "caption" }}
      />

      <Box sx={{ mr: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {isLoading ? (
            <Skeleton>--</Skeleton>
          ) : tokenBalances && token && balance ? (
            formatBigNumber(balance, token.decimals)
          ) : (
            "0.0"
          )}
        </Typography>
      </Box>
    </ListItemButton>
  );
}

export default memo(SelectCoinListUniswapItem);
