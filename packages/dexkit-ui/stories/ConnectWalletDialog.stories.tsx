import { useWalletActivate } from "@dexkit/core/hooks";
import { WalletActivateParams } from "@dexkit/core/types";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useWeb3React } from "@web3-react/core";
import { atomWithStorage } from "jotai/utils";
import { ConnectWalletDialog } from "../components/ConnectWalletDialog";
import { DexkitProvider } from "../components/DexkitProvider";
import theme from "../theme";

export default {
  title: "Components/ConnectWalletDialog",
  component: ConnectWalletDialog,
  argTypes: {},
} as ComponentMeta<typeof ConnectWalletDialog>;

const pendingTransactionsAtom = atomWithStorage("storybook-transactions", {});
const queryClient = new QueryClient();

const WrappedComponent = () => {
  const walletActivate = useWalletActivate();
  const { isActive } = useWeb3React();

  return (
    <ConnectWalletDialog
      DialogProps={{ open: true, maxWidth: "sm", fullWidth: true }}
      activate={async (params: WalletActivateParams) => {
        walletActivate.mutation.mutateAsync(params);
      }}
      activeConnectorName={walletActivate.connectorName}
      isActivating={walletActivate.mutation.isLoading}
      isActive={isActive}
    />
  );
};

const Template: ComponentStory<typeof ConnectWalletDialog> = (args) => {
  return (
    <QueryClientProvider client={queryClient}>
      <DexkitProvider
        pendingTransactionsAtom={pendingTransactionsAtom}
        theme={theme}
      >
        <WrappedComponent />
      </DexkitProvider>
    </QueryClientProvider>
  );
};

export const Default = Template.bind({});
Default.args = {};
