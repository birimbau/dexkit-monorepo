import { ChainId } from "../constants/enums";
import { NETWORK_PROVIDER_SERVER } from "../constants/networks";

export function useNetworkProvider(chainId?: ChainId) {
  return NETWORK_PROVIDER_SERVER(chainId);
}
