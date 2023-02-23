import { WHITELISTED_IMAGE_DOMAINS } from "../constants";
import { isIpfsUri } from "./ipfs";


export function isWhitelistedDomain(src: string) {
  if (isIpfsUri(src)) {
    return src;
  } else {
    const imageUrl = new URL(src);
    return WHITELISTED_IMAGE_DOMAINS.includes(imageUrl.hostname);
  }
}