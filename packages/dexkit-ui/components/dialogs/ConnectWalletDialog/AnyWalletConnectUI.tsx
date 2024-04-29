import { useEffect, useState } from "react";

import { Wallet, type InjectedSupportedWalletIds } from "thirdweb/wallets";
import { InjectedConnectUI } from "./InjectedConnectUI";
import { useWalletInfo } from "./hooks/useWalletInfo";
import { getInstalledWalletProviders } from "./utils/injectedProviders";

export function AnyWalletConnectUI(props: {
  wallet: Wallet;
  done: () => void;
  client: any;
  chain: any;
  onBack?: () => void;
  setModalVisibility: (value: boolean) => void;
}) {
  const [screen, setScreen] = useState<"main" | "get-started">("main");
  const walletInfo = useWalletInfo(props.wallet.id);

  useEffect(() => {
    if (!walletInfo.data) {
      return;
    }
    /* getInjectedWalletLocale(localeId).then((w) => {
      setLocale(w(walletInfo.data.name));
    });*/
  }, [walletInfo.data]);

  // if wallet can connect to injected wallet + wallet is injected
  const isInstalled = getInstalledWalletProviders().find(
    (w) => w.info.rdns === walletInfo?.data?.rdns
  );

  if (walletInfo?.data?.rdns && isInstalled) {
    return (
      <InjectedConnectUI
        wallet={props.wallet as Wallet<InjectedSupportedWalletIds>}
        walletInfo={walletInfo.data}
        done={props.done}
        client={client}
        chain={chain}
        onGetStarted={() => {
          setScreen("get-started");
        }}
        onBack={props.onBack}
      />
    );
  }

  // if can't connect in any way - show get started screen
  return <></>;
}
