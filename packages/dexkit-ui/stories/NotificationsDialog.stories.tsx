import { ChainId, TransactionStatus } from "@dexkit/core/constants";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { IntlProvider } from "react-intl";
import NotificationsDialog from "../components/dialogs/NotificationsDialog";
import { COMMON_NOTIFICATION_TYPES } from "../constants/messages/common";

function Component() {
  const handleClear = () => {};

  return (
    <IntlProvider locale="en-US" defaultLocale="en-US">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />
      <NotificationsDialog
        transactions={{
          ["testtx"]: {
            chainId: ChainId.Ethereum,
            status: TransactionStatus.Confirmed,
            created: new Date().getTime(),
          },
        }}
        DialogProps={{ open: true, maxWidth: "sm", fullWidth: true }}
        onClear={handleClear}
        notifications={[
          {
            icon: "send",
            type: "transaction",
            subtype: "approve",
            date: new Date().getTime(),
            values: {
              symbol: "USDT",
              name: "Tether",
            },
            metadata: { hash: "testtx" },
          },
          {
            type: "transaction",
            subtype: "approve",
            date: new Date().getTime(),
            values: {
              symbol: "USDT",
              name: "Tether",
            },
            metadata: { hash: "testtx" },
          },
        ]}
        notificationTypes={COMMON_NOTIFICATION_TYPES}
      />
    </IntlProvider>
  );
}

export default {
  title: "Components/NotificationsDialog",
  component: Component,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof Component>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Component> = (args) => <Component />;

export const Default = Template.bind({});
Default.args = {};
