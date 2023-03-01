import { useMutation } from "@tanstack/react-query";
import { useWeb3React } from "@web3-react/core";
import { metaMask } from "../constants/connectors/metamask";
import { WalletActivateParams } from "../types";

import { useAtom } from "jotai";
import { walletConnectorAtom } from "../atoms";

export function useWalletActivate() {
  const { connector } = useWeb3React();

  const [walletConnector, setWalletConnector] = useAtom(walletConnectorAtom);

  const mutation = useMutation(async (params: WalletActivateParams) => {
    if (connector.deactivate) {
      await connector.deactivate();
    }

    if (params.connectorName === "metamask") {
      setWalletConnector("metamask");
      return await metaMask.activate();
    } else if (params.connectorName === "magic") {
      // setWalletConnector("magic");
      // return await magic.activate({
      //   loginType,
      //   email,
      // });
    }
  });

  return { connectorName: walletConnector, mutation };
}
