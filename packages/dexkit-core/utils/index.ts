import { MetaMask } from "@web3-react/metamask";
import { Connector } from "@web3-react/types";

export function getConnectorName(connector?: Connector) {
  // if (connector instanceof MagicConnector) {
  //   return 'magic';
  // }

  if (connector instanceof MetaMask) {
    return "metamask";
  }
}
