import { MetaMask } from "@web3-react/metamask";
import { Connector } from "@web3-react/types";
import { BigNumber, ethers } from "ethers";
import { EventEmitter } from "events";
import { ChainId } from "../constants";
import { NETWORKS } from "../constants/networks";
import { MagicConnector } from "../types/magic";

export function getConnectorName(connector?: Connector) {
  if (connector instanceof MagicConnector) {
    return "magic";
  }

  if (connector instanceof MetaMask) {
    return "metamask";
  }
}

export function parseChainId(chainId: string | number) {
  return typeof chainId === "number"
    ? chainId
    : Number.parseInt(chainId, chainId.startsWith("0x") ? 16 : 10);
}

export function waitForEvent<T>(
  emitter: EventEmitter,
  event: string,
  rejectEvent: string
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    emitter.once(event, (args) => {
      resolve(args);
    });
    emitter.once(rejectEvent, () => reject("rejected by the user"));
    emitter.once("error", reject);
  });
}

export const truncateAddress = (address: string | undefined) => {
  if (address !== undefined && ethers.utils.isAddress(address)) {
    return `${address.slice(0, 7)}...${address.slice(address.length - 5)}`;
  }
  return "";
};

export function hasLondonHardForkSupport(chainId: ChainId) {
  switch (chainId) {
    case ChainId.Ropsten:
    case ChainId.Ethereum:
    case ChainId.Goerli:
    case ChainId.Polygon:
    case ChainId.Mumbai:
      return true;

    default:
      return false;
  }
}

export function getNativeTokenSymbol(chainId?: number) {
  if (chainId) {
    return NETWORKS[chainId]?.symbol;
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

export function getBlockExplorerUrl(chainId?: number) {
  if (chainId) {
    return NETWORKS[chainId].explorerUrl;
  }
}
