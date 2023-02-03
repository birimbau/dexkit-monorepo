import Swap from "./Swap";

import { useWeb3React } from "@web3-react/core";
import { useSetAtom } from "jotai";
import ReactDOM from "react-dom";
import { showConnectWalletAtom } from "../../components/atoms";
import DexkitContextProvider from "../../components/DexkitContextProvider";
import { useCurrency } from "../../hooks";

function SwapWidget() {
  const { chainId, account, provider, isActivating, isActive } = useWeb3React();
  const currency = useCurrency();
  const setShowWallet = useSetAtom(showConnectWalletAtom);

  const handleConnectWallet = () => {
    setShowWallet(true);
  };

  return (
    <Swap
      provider={provider}
      account={account}
      chainId={chainId}
      currency={currency}
      isActive={isActive}
      isActivating={isActivating}
      onConnectWallet={handleConnectWallet}
    />
  );
}

const el = document.getElementById("dexkit-swap");

ReactDOM.render(
  <DexkitContextProvider>
    <SwapWidget />
  </DexkitContextProvider>,
  el
);
