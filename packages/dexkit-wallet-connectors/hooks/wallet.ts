import { useMutation } from "@tanstack/react-query";
import { useWeb3React } from "@web3-react/core";
import { metaMask } from "../constants/connectors/metamask";
import { WalletActivateParams } from "../types";

import { PrimitiveAtom, useAtom } from "jotai";
import { magic } from "../constants/connectors/magic";
import { walletConnect } from "../constants/connectors/walletConnect";

export function useWalletActivate({
  magicRedirectUrl,
  selectedWalletAtom,
}: {
  magicRedirectUrl: string;
  selectedWalletAtom: PrimitiveAtom<string>;
}) {
  const { connector } = useWeb3React();

  const [walletConnector, setWalletConnector] = useAtom(selectedWalletAtom);

  const mutation = useMutation(async (params: WalletActivateParams) => {
    if (connector.deactivate) {
      await connector.deactivate();
    }

    if (params.connectorName === "metamask") {
      setWalletConnector("metamask");
      return await metaMask.activate();
    } else if (params.connectorName === "magic") {
      setWalletConnector("magic");
      return await magic.activate({
        loginType: params.loginType,
        email: params.email,
        redirectUrl: magicRedirectUrl,
      });
    } else if (params.connectorName === "walletConnect") {
      setWalletConnector("walletConnect");
      return await walletConnect.activate();
    }
  });

  return { connectorName: walletConnector, mutation };
}


