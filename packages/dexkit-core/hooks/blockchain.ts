import { ChainId } from "../constants/enums";
import { NETWORK_PROVIDER } from "../constants/networks";

export function useNetworkProvider(chainId?: ChainId) {
  return NETWORK_PROVIDER(chainId);
}
