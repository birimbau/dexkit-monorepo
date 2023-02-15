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
        handleNotification,
        handleConnectWallet,
        handleShowTransactions,
      }) => (
        <Grid container justifyContent="center" spacing={2}>
          <Grid item xs={12} sm={4}>
            <SwapWidget
              {...args}
              onNotification={handleNotification}
              onConnectWallet={handleConnectWallet}
              onShowTransactions={handleShowTransactions}
            />
          </Grid>
        </Grid>
      )}
    </DexkitContextProvider>
  );
};

export const Default = Template.bind({});

Default.args = {
  renderOptions: {},
};

export const TokensSelected = Template.bind({});

TokensSelected.args = {
  renderOptions: {
    defaultSellToken: OPTIMISM_TOKEN,
    defaultChainId: ChainId.Optimism,
  },
};

export const NoNotifications = Template.bind({});

NoNotifications.args = {
  renderOptions: {
    disableNotificationsButton: true,
  },
};

export const WithTransak = Template.bind({});

WithTransak.args = {
  renderOptions: {
    transakApiKey: "4cf44cc4-69d7-4f4d-8237-05cc9076aa41",
  },
};
