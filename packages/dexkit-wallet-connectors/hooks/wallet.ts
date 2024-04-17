import { useMutation } from "@tanstack/react-query";
import { useWeb3React } from "@web3-react/core";
import { WalletActivateParams } from "../types";

import { PrimitiveAtom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { magic } from "../constants/connectors/magic";

export function useWalletActivate({
  magicRedirectUrl,
  selectedWalletAtom,
}: {
  magicRedirectUrl: string;
  selectedWalletAtom: PrimitiveAtom<string>;
}) {
  const { chainId } = useWeb3React();
  const { setWalletConnectorMetadata } = useWalletConnectorMetadata()
  // This should be deprecated
  const [walletConnector, setWalletConnector] = useAtom(selectedWalletAtom);

  const mutation = useMutation(async (params: WalletActivateParams) => {
    /* if (connector.deactivate) {
       await connector.deactivate();
     }*/
    const connector = params.connector;
    if (params?.overrideActivate && params?.overrideActivate(chainId)) return;


    if (params.connectorName === "magic") {
      setWalletConnectorMetadata(
        {
          id: params.connectorName,
          icon: params.icon,
          name: params.name
        }
      )
      // This should be deprecated
      setWalletConnector("magic");
      return await magic.activate({
        loginType: params?.loginType,
        email: params.email,
        redirectUrl: magicRedirectUrl,
      });
    } else {
      setWalletConnectorMetadata(
        {
          id: params.connectorName,
          icon: params.icon,
          name: params.name
        }
      )
      // This should be deprecated
      setWalletConnector(params.connectorName);


      return await connector.activate();
    }
  });

  return { connectorName: walletConnector, mutation };
}

const walletConnectorMetadataAtom = atomWithStorage<{ id?: string, name?: string, icon?: string }>("wallet-connector-metadata", {});

/**
 * Return current active connector metadata
 * @returns 
 */
export function useWalletConnectorMetadata() {
  const [walletConnectorMetadata, setWalletConnectorMetadata] = useAtom(walletConnectorMetadataAtom);
  return {
    walletConnectorMetadata,
    setWalletConnectorMetadata
  }

}