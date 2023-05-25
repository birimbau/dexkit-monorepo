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
  [ChainId.Ethereum]: "api.etherscan.io",
  [ChainId.Polygon]: "api.polygonscan.com",
  [ChainId.Arbitrum]: "api.arbiscan.io",
  [ChainId.Optimism]: "api-optimistic.etherscan.io",
  [ChainId.BSC]: "api.bscscan.com",
  [ChainId.Fantom]: "api.ftmscan.com",
  [ChainId.Avax]: "api.snowtrace.io",
  [ChainId.Mumbai]: "api-testnet.polygonscan.com",
  [ChainId.Goerli]: "api-goerli.etherscan.io",
};

export const WEB3FORMS_INPUT_TYPES: {
  [key: string]: {
    name: string;
    messageId: string;
    defaultMessage: string;
    type: string;
  };
} = {
  address: {
    name: "Address input",
    messageId: "address.input",
    defaultMessage: "Address input",
    type: "address",
  },
  switch: {
    name: "switch",
    messageId: "switch.button",
    defaultMessage: "Switch Button",
    type: "bool",
  },
  decimal: {
    name: "decimal",
    messageId: "formatted.decimal",
    defaultMessage: "Formatted Decimal",
    type: "uint256",
  },
};
