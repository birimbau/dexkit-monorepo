import { ChainId } from "@dexkit/core/constants";

export const PARSE_UNITS = [
  "ether",
  "milliether",
  "microether",
  "gwei",
  "kwei",
  "wei",
];

export const ETHER_SCAN_API_URL: { [key: number]: string } = {
  [ChainId.Ethereum]: "etherscan",
};
