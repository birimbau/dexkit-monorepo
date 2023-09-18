import { TOKEN_ICON_URL } from "@dexkit/core";
import { Token } from "@dexkit/core/types";
import { getChainName, getNormalizedUrl } from "@dexkit/core/utils";
import {
  Avatar,
  Checkbox,
  Chip,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
} from "@mui/material";
import { useCallback } from "react";
import { FormattedMessage } from "react-intl";
import { isTokenEqual } from "../../utils";

export interface ExchangeTokenListInputProps {
  selectedTokens: {
    [key: string]: Token;
  };
  tokens: Token[];
  isEdit?: boolean;
  onSelect: (token: Token) => void;
  selectedToken?: Token;
}

export default function ExchangeTokenListInput({
  selectedTokens,
  tokens,
  isEdit,
  onSelect,
  selectedToken,
}: ExchangeTokenListInputProps) {
  const handleSelect = useCallback(
    (token: Token) => {
      return () => {
        onSelect(token);
      };
    },
    [onSelect]
  );

  return (
    <List disablePadding>
      {tokens.map((token, key) => (
        <ListItemButton divider onClick={handleSelect(token)} key={key}>
          <ListItemAvatar>
            <Avatar
              src={
                token.logoURI
                  ? getNormalizedUrl(token.logoURI)
                  : TOKEN_ICON_URL(token.contractAddress, token.chainId)
              }
            />
          </ListItemAvatar>
          <ListItemText
            primary={token.symbol.toUpperCase()}
            secondary={getChainName(token.chainId)}
          />
          <ListItemSecondaryAction>
            {isEdit ? (
              <Checkbox
                checked={isTokenEqual(
                  selectedTokens[`${token.chainId}-${token.contractAddress}`],
                  token
                )}
              />
            ) : (
              isTokenEqual(selectedToken, token) && (
                <Chip
                  label={
                    <FormattedMessage id="default" defaultMessage="Default" />
                  }
                />
              )
            )}
          </ListItemSecondaryAction>
        </ListItemButton>
      ))}
    </List>
  );
}
