import { useMutation } from "@tanstack/react-query";
import { useWeb3React } from "@web3-react/core";
import { WalletActivateParams } from "../types";

import { PrimitiveAtom, useAtom } from "jotai";
import { magic } from "../constants/connectors/magic";

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

    if (params.connectorName === "magic") {
      setWalletConnector("magic");
      return await magic.activate({
        loginType: params.loginType,
        email: params.email,
        redirectUrl: magicRedirectUrl,
      });
    } else {
      setWalletConnector(params.connectorName);
      return await connector.activate();
    }
  });

  return { connectorName: walletConnector, mutation };
}


