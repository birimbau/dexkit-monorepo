import { parseChainId } from "@dexkit/core/utils";
import { MetaMask } from "@web3-react/metamask";
import { Connector } from "@web3-react/types";
import { EventEmitter } from "events";
import { MagicConnector } from "../connectors/magic";



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

export async function switchNetwork(connector: Connector, chainId: number) {
  if (connector instanceof MetaMask) {
    return connector.provider?.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  }

  if (connector instanceof MagicConnector) {
    return connector.changeNetwork(parseChainId(chainId));
  }

  return connector.provider?.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: `0x${chainId.toString(16)}` }],
  });
}

/**
 * Returns true if the string is a RFC2397-compliant data URI
 * @see {@link https://www.rfc-editor.org/rfc/rfc2397}
 */
export default function isDataURI(uri: string): boolean {
  return /data:(image\/[-+\w.]+)(;?\w+=[-\w]+)*(;base64)?,.*/gu.test(uri)
}
