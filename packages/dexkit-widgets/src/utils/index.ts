import { Token } from "@dexkit/core/types";
import { MagicConnector } from "@dexkit/wallet-connectors/connectors/magic";

import { MetaMask } from "@web3-react/metamask";
import { Connector } from "@web3-react/types";
import { BigNumber, ethers } from "ethers";

// import { MagicConnector } from "../connectors/magic";

export function getConnectorName(connector?: Connector) {
  // if (connector instanceof MagicConnector) {
  //   return "magic";
  // } else

  if (connector instanceof MetaMask) {
    return "metamask";
  }
}

export function isAddressEqual(address?: string, other?: string) {
  if (address === undefined || other === undefined) {
    return false;
  }

  if (!ethers.utils.isAddress(address) || !ethers.utils.isAddress(other)) {
    return false;
  }

  return address.toLowerCase() === other.toLowerCase();
}

export function formatBigNumber(val: BigNumber, decimals: number) {
  // TODO: improve this code in the future
  // pass to a memoized component or something
  const value = ethers.utils.formatUnits(val, decimals);

  let index = value.indexOf(".");

  if (val.isZero()) {
    return value;
  }

  while (true) {
    index = index + 1;

    if (value.at(index) !== "0") {
      break;
    }
  }

  let ending = index;

  while (true) {
    ending = ending + 1;

    if (ending === value.length - 1 || ending === index + 4) {
      break;
    }
  }

  return value.substring(0, ending);
}

export function parseChainId(chainId: string | number) {
  return typeof chainId === "number"
    ? chainId
    : Number.parseInt(chainId, chainId.startsWith("0x") ? 16 : 10);
}

export async function switchNetwork(connector: Connector, chainId: number) {
  if (connector instanceof MetaMask) {
    return connector.provider?.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  } else if (connector instanceof MagicConnector) {
    connector.changeNetwork(chainId);
  }
}

export function tokenKey(token: Token) {
  return `${token.chainId}-${token.address.toLowerCase()}`;
}
