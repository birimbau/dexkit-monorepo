import { DexkitProvider } from "@dexkit/ui/components";
import { COMMON_NOTIFICATION_TYPES } from "@dexkit/ui/constants/messages/common";
import { useTheme } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import {
  notificationsAtom,
  selectedWalletAtom,
  transactionsAtomV2,
} from "../state/atoms";

export interface AppMarketplaceContextProps {
  children: React.ReactNode | React.ReactNode[];
}

export function WidgetContext({ children }: AppMarketplaceContextProps) {
  const theme = useTheme();
  const [locale, setLocale] = useState("en-US");
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <DexkitProvider
        locale={locale}
        defaultLocale={locale}
        theme={theme}
        selectedWalletAtom={selectedWalletAtom}
        options={{
          magicRedirectUrl: process.env.NEXT_PUBLIC_MAGIC_REDIRECT_URL || "",
        }}
        notificationTypes={{
          ...COMMON_NOTIFICATION_TYPES,
        }}
        transactionsAtom={transactionsAtomV2}
        notificationsAtom={notificationsAtom}
        onChangeLocale={(loc) => setLocale(loc)}
      >
        {children}
      </DexkitProvider>
    </QueryClientProvider>
  );
}
