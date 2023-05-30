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
    helpMessageId: string;
    helpDefaultMessage: string;
    type: string;
  };
} = {
  address: {
    name: "Address input",
    messageId: "address.input",
    defaultMessage: "Address input",
    helpMessageId: "address.input.type.description",
    helpDefaultMessage:
      'The "address input" type serves to define an enumeration of addresses that can be used in this input',
    type: "address",
  },
  connectedAccount: {
    name: "Connected account",
    messageId: "connected.account",
    defaultMessage: "Connected account",
    helpMessageId: "connected.account.input.type.description",
    helpDefaultMessage:
      'The "Connected account" type is used to makes the input use the connected account of the user wallet',
    type: "address",
  },
  switch: {
    name: "switch",
    messageId: "switch.button",
    defaultMessage: "Switch Button",
    helpMessageId: "switch.type.description",
    helpDefaultMessage:
      'The "switch" type serves to change the input component of this field to a visual "switch" component instead of a free text field',
    type: "bool",
  },
  decimal: {
    name: "decimal",
    messageId: "formatted.decimal",
    defaultMessage: "Formatted Decimal",
    helpMessageId: "decimal.type.description",
    helpDefaultMessage:
      'The "decimal" type serves to insert numbers in decimal format according to the total of decimals defined in the field below.',
    type: "uint256",
  },
};
