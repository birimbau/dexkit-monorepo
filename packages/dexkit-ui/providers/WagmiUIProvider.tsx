import { wagmiConfig } from "@dexkit/wallet-connectors/constants/wagmiConfig";
import React, { useMemo } from "react";
import { WagmiProvider } from "wagmi";
import type { AppConfig } from "../modules/wizard/types/config";

interface Props {
  children: React.ReactNode;
  config: AppConfig;
}

export function WagmiUIProvider({ children }: Props) {
  const config = useMemo(() => {
    return wagmiConfig;
  }, []);

  return <WagmiProvider config={config}>{children}</WagmiProvider>;
}
