import type { TokenBalances } from "@indexed-finance/multicall";
import {
  Avatar,
  Box,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Skeleton,
} from "@mui/material";
import { BigNumber, constants } from "ethers";
import { memo } from "react";

import { TOKEN_ICON_URL } from "@dexkit/core/constants";
import { Token } from "@dexkit/core/types";
import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "../services/zeroex/constants";
import { formatBigNumber } from "../utils";

export interface SelectCoinListItemProps {
  token: Token;
  onSelect: (token: Token) => void;
  tokenBalances?: TokenBalances;
  isLoading: boolean;
}

function SelectCoinListItem({
  token,
  onSelect,
  tokenBalances,
  isLoading,
}: SelectCoinListItemProps) {
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
        <Avatar
          src={
            token.logoURI
              ? token.logoURI
              : TOKEN_ICON_URL(token.address, token.chainId)
          }
          imgProps={{ sx: { objectFit: "fill" } }}
        />
      </ListItemAvatar>
      <ListItemText
        primary={token.symbol.toUpperCase()}
        secondary={token.name}
      />

      <Box sx={{ mr: 2 }}>
        {isLoading ? (
          <Skeleton>--</Skeleton>
        ) : tokenBalances && token && balance ? (
          formatBigNumber(balance, token.decimals)
        ) : (
          "0.0"
        )}
      </Box>
    </ListItemButton>
  );
}

export default memo(SelectCoinListItem);
