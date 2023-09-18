import { TokenBalances } from "@indexed-finance/multicall";
import {
  Avatar,
  Box,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { BigNumber, ethers } from "ethers";
import { memo } from "react";

import { TOKEN_ICON_URL } from "@dexkit/core/constants";
import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "../services/zeroex/constants";
import { Token } from "../types";
import { formatBigNumber, isAddressEqual } from "../utils";

export interface SelectCoinListItemProps {
  token: Token;
  onSelect: (token: Token) => void;
  tokenBalances?: TokenBalances;
}

function SelectCoinListItem({
  token,
  onSelect,
  tokenBalances,
}: SelectCoinListItemProps) {
  const balance = tokenBalances
    ? tokenBalances[
        isAddressEqual(token.contractAddress, ZEROEX_NATIVE_TOKEN_ADDRESS)
          ? ethers.constants.AddressZero
          : token.contractAddress
      ]
    : BigNumber.from(0);

  return (
    <ListItemButton onClick={() => onSelect(token)}>
      <ListItemAvatar>
        <Avatar
          src={
            token.logoURI
              ? token.logoURI
              : TOKEN_ICON_URL(token.contractAddress, token.chainId)
          }
        />
      </ListItemAvatar>
      <ListItemText
        primary={token.symbol.toUpperCase()}
        secondary={token.name}
      />
      <Box sx={{ mr: 2 }}>
        {tokenBalances && token && balance
          ? formatBigNumber(balance, token.decimals)
          : "0.0"}
      </Box>
    </ListItemButton>
  );
}

export default memo(SelectCoinListItem);
