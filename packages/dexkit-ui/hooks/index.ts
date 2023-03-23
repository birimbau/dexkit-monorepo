import { CONNECTORS } from "@dexkit/core/constants";
import { Web3ReactHooks } from "@web3-react/core";
import { Connector } from "@web3-react/types";
import { PrimitiveAtom, useAtomValue } from "jotai";
import { useMemo } from "react";

export function useOrderedConnectors({
  selectedWalletAtom,
}: {
  selectedWalletAtom: PrimitiveAtom<string>;
}) {
  const selectedWallet = useAtomValue(selectedWalletAtom);

  return useMemo(() => {
    let connectors: [Connector, Web3ReactHooks][] = [];

    if (selectedWallet) {
      const otherConnectors = Object.keys(CONNECTORS)
        .filter((key) => selectedWallet !== key)
        .map((key) => CONNECTORS[key]);

      connectors = [CONNECTORS[selectedWallet], ...otherConnectors];
    } else {
      const otherConnectors = Object.keys(CONNECTORS).map(
        (key) => CONNECTORS[key]
      );

      connectors = otherConnectors;
    }

    return connectors;
  }, [selectedWallet]);
}
