import { useWalletActivate } from "@dexkit/core/hooks";
import { WalletActivateParams } from "@dexkit/core/types";
import { ConnectWalletDialog, DexkitProvider } from "@dexkit/ui/components";
import { createTheme, Grid } from "@mui/material";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useWeb3React } from "@web3-react/core";
import { atom } from "jotai";
import { useState } from "react";
import { SwapWidget, SwapWidgetProps } from "../../src/widgets/swap";

const pendingTransactionsAtom = atom<{}>({});

function Component(props: SwapWidgetProps) {
  const { isActive } = useWeb3React();
  const walletActivate = useWalletActivate();
  const [showConnectWallet, setShowConnectWallet] = useState(false);

  const handleClose = () => {};

  return (
    <>
      <ConnectWalletDialog
        DialogProps={{
          open: showConnectWallet,
          maxWidth: "sm",
          fullWidth: true,
          onClose: handleClose,
        }}
        activate={async (params: WalletActivateParams) => {
          walletActivate.mutation.mutateAsync(params);
        }}
        activeConnectorName={walletActivate.connectorName}
        isActivating={walletActivate.mutation.isLoading}
        isActive={isActive}
      />

      <SwapWidget
        {...props}
        onConnectWallet={() => {
          setShowConnectWallet(true);
        }}
      />
    </>
  );
}

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/Swap With Context",
  component: SwapWidget,
} as ComponentMeta<typeof SwapWidget>;

const zeroExApiKey = process.env.ZRX_RFQ_API_KEY;

const queryClient = new QueryClient();

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SwapWidget> = (args: SwapWidgetProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <DexkitProvider
        locale="en-US"
        pendingTransactionsAtom={pendingTransactionsAtom}
        defaultLocale="en-US"
        theme={createTheme()}
      >
        <Grid container justifyContent="center" spacing={2}>
          <Grid item xs={12} sm={4}>
            <Component
              {...args}
              onNotification={() => {}}
              onShowTransactions={() => {}}
              isAutoSlippage={true}
              maxSlippage={0}
              onChangeSlippage={() => {}}
              onAutoSlippage={() => {}}
            />
          </Grid>
        </Grid>
      </DexkitProvider>
    </QueryClientProvider>
  );
};

export const Default = Template.bind({});

Default.args = {
  renderOptions: {
    configsByChain: {},
    zeroExApiKey,
    defaultChainId: 137,
  },
};
