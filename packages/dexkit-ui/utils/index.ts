import { TOKEN_ICON_URL } from "@dexkit/core";
import { Token } from "@dexkit/core/types";

export function TOKEN_ICON_URL_V2(token: Token) {
  return token.logoURI
    ? token.logoURI
    : TOKEN_ICON_URL(token.address, token.chainId);
}
