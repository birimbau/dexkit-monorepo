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
  const value = ethers.utils.formatUnits(val, decimals);

  return value;
}
