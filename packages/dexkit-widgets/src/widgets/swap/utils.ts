import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "@dexkit/core/constants/zrx";
import { Token } from "@dexkit/core/types";
import { SwapSide } from "./types";

/**
 * Remove this function after all tokens are migrated to new interface
 * @param tk 
 * @returns 
 */
export function convertOldTokenToNew(tk?: Token) {
  //@ts-ignore
  if (tk && tk?.contractAddress) {
    //@ts-ignore
    tk.address = tk?.contractAddress;
  }
  return tk;
}
/**
 * Gasless swaps don't work with native token
 * @param param0 
 * @returns 
 */
export function isNativeInSell({ side, sellToken, buyToken }: { side: SwapSide, sellToken: Token, buyToken: Token }) {

  if (side === 'buy' && buyToken && buyToken.address.toLowerCase() === ZEROEX_NATIVE_TOKEN_ADDRESS) {
    return true;
  }

  if (side === 'sell' && sellToken && sellToken.address.toLowerCase() === ZEROEX_NATIVE_TOKEN_ADDRESS) {
    return true;
  }

  return false




}