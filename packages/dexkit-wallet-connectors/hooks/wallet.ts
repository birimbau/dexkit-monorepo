import { useMutation } from "@tanstack/react-query";
import { useWeb3React } from "@web3-react/core";
import { ConnectionType, WalletActivateParams } from "../types";

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


    setWalletConnectorMetadata(
      {
        id: params?.connectorName,
        icon: params?.icon,
        rdns: params?.rdns,
        name: params?.name,
        type: params?.connectionType
      }
    )

    if (params?.loginType) {
      // This should be deprecated
      setWalletConnector("magic");
      const activedConnector = await magic.activate({
        loginType: params?.loginType,
        email: params.email,
        redirectUrl: magicRedirectUrl,
      });
      return activedConnector;
    } else {

      // This should be deprecated
      setWalletConnector(params?.connectorName);


      const activatedConnector = await connector.activate();
      return activatedConnector;
    }
  });

  return { connectorName: walletConnector, mutation };
}

const walletConnectorMetadataAtom = atomWithStorage<{ id?: string, name?: string, icon?: string, rdns?: string, type?: ConnectionType }>("wallet-connector-metadata", {});

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