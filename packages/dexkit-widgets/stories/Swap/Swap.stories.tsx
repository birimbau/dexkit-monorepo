import { Grid } from "@mui/material";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import DexkitContextProvider from "../../src/components/DexkitContextProvider";
import { OPTIMISM_TOKEN } from "../../src/constants";
import { ChainId } from "../../src/constants/enum";
import { SwapWidget, SwapWidgetProps } from "../../src/widgets/swap";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Example/Swap",
  component: SwapWidget,
} as ComponentMeta<typeof SwapWidget>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SwapWidget> = (args: SwapWidgetProps) => {
  return (
    <DexkitContextProvider>
      {({
        isAutoSlippage,
        maxSlippage,
        handleNotification,
        handleConnectWallet,
        handleShowTransactions,
        handleAutoSlippage,
        handleChangeSlippage,
      }) => (
        <Grid container justifyContent="center" spacing={2}>
          <Grid item xs={12} sm={4}>
            <SwapWidget
              {...args}
              onNotification={handleNotification}
              onConnectWallet={handleConnectWallet}
              onShowTransactions={handleShowTransactions}
              isAutoSlippage={isAutoSlippage}
              maxSlippage={maxSlippage}
              onChangeSlippage={handleChangeSlippage}
              onAutoSlippage={handleAutoSlippage}
            />
          </Grid>
        </Grid>
      )}
    </DexkitContextProvider>
  );
};

export const Default = Template.bind({});

Default.args = {
  renderOptions: {
    configsByChain: {},
  },
};

export const TokensSelected = Template.bind({});

TokensSelected.args = {
  renderOptions: {
    configsByChain: {
      [ChainId.Optimism]: {
        slippage: 0,
        sellToken: OPTIMISM_TOKEN,
      },
    },
    defaultChainId: ChainId.Optimism,
  },
};

export const NoNotifications = Template.bind({});

NoNotifications.args = {
  renderOptions: {
    configsByChain: {},
    disableNotificationsButton: true,
  },
};

export const WithTransak = Template.bind({});

WithTransak.args = {
  renderOptions: {
    configsByChain: {},
    transakApiKey: "4cf44cc4-69d7-4f4d-8237-05cc9076aa41",
  },
};

export const WithTransakButton = Template.bind({});

WithTransakButton.args = {
  renderOptions: {
    configsByChain: {},
    transakApiKey: "4cf44cc4-69d7-4f4d-8237-05cc9076aa41",
    enableBuyCryptoButton: true,
  },
};

export const DisableFooter = Template.bind({});

DisableFooter.args = {
  renderOptions: {
    configsByChain: {},
    disableFooter: true,
  },
};
