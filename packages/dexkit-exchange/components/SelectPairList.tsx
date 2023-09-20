import { Token } from "@dexkit/core/types";
import {
  Avatar,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";

import { TOKEN_ICON_URL } from "@dexkit/core";
import { isAddressEqual } from "@dexkit/core/utils";
import TokenIcon from "@mui/icons-material/Token";

export interface SelectPairListProps {
  quoteTokens: Token[];
  baseToken?: Token;
  quoteToken?: Token;
  onSelect: (quoteToken: Token) => void;
}

export default function SelectPairList({
  quoteTokens,
  quoteToken,
  baseToken,
  onSelect,
}: SelectPairListProps) {
  return (
    <List disablePadding>
      {quoteTokens.map((token, key) => (
        <ListItemButton
          selected={
            quoteToken?.chainId == token.chainId &&
            isAddressEqual(token.contractAddress, quoteToken.contractAddress)
          }
          key={key}
          onClick={() => onSelect(token)}
        >
          <ListItemAvatar>
            <Avatar
              src={
                token.logoURI
                  ? token.logoURI
                  : TOKEN_ICON_URL(token.contractAddress, token.chainId)
              }
            >
              <TokenIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={`${token.symbol.toUpperCase()}/${baseToken?.symbol.toUpperCase()}`}
          />
        </ListItemButton>
      ))}
    </List>
  );
}
