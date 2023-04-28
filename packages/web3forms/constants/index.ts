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
  [ChainId.Ethereum]: "etherscan.io",
  [ChainId.Polygon]: "polygonscan.com",
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
};
