import { ComponentMeta, ComponentStory } from "@storybook/react";
import TradeWidget from "../components/TradeWidget";

import ThemeProvider from "@mui/material/styles/ThemeProvider";
import createTheme from "@mui/material/styles/createTheme";
import { IntlProvider } from "react-intl";

export default {
  title: "Components/TradeWdiget",
  component: TradeWidget,
  argTypes: {},
} as ComponentMeta<typeof TradeWidget>;

const theme = createTheme({
  typography: {
    fontFamily: '"Sora", sans-serif',
  },
  palette: {
    mode: "dark",
    background: {
      default: "#151B22",
      paper: "#0D1017",
    },
    primary: {
      main: "#F9AB74",
    },
    divider: "#313842",
  },
});

const Template: ComponentStory<typeof TradeWidget> = (args) => (
  <IntlProvider defaultLocale="en-US" locale="en-US">
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
    <link
      href="https://fonts.googleapis.com/css2?family=Sora:wght@100;200;400;500;600;700;800&display=swap"
      rel="stylesheet"
    />
    <ThemeProvider theme={theme}>
      <TradeWidget {...args} />
    </ThemeProvider>
  </IntlProvider>
);

export const Default = Template.bind({});
Default.args = {};
