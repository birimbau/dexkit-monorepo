import { SLUG_OVERLAPP } from "../constants";
import ALL_CHAINS from '../constants/all-chains.json';


export const GET_NETWORK_SLUG = (chainId: number) => {
  if (chainId) {
    const slug = SLUG_OVERLAPP[chainId];
    if (slug) {
      return slug
    } else {
      return ALL_CHAINS.find(ch => ch.chainId === chainId)?.shortName;
    }
  }


}