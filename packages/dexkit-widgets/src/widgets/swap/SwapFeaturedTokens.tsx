import { Avatar, Box, Chip, Stack } from "@mui/material";
import { memo } from "react";
import { TOKEN_ICON_URL } from "../../constants";
import { ChainId } from "../../constants/enum";
import { Token } from "../../types";

export interface SwapFeaturedTokensProps {
  chainId?: ChainId;
  onSelect: (token: Token) => void;
  tokens?: Token[];
}

function SwapFeaturedTokens({
  chainId,
  onSelect,
  tokens,
}: SwapFeaturedTokensProps) {
  if (tokens?.length === 0) {
    return null;
  }

  return (
    <Box px={2}>
      <Stack direction="row" spacing={1}>
        {tokens?.map((token, index) => (
          <Chip
            key={index}
            icon={
              <Avatar
                sx={(theme) => ({
                  height: theme.spacing(2.5),
                  width: theme.spacing(2.5),
                })}
                src={
                  token.logoURI
                    ? token.logoURI
                    : TOKEN_ICON_URL(token.contractAddress, token.chainId)
                }
              />
            }
            onClick={() => onSelect(token)}
            clickable
            label={token.symbol.toUpperCase()}
          />
        ))}
      </Stack>
    </Box>
  );
}

export default memo(SwapFeaturedTokens);
