import { createTheme } from "@mui/material";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { atom } from "jotai";
import { DexkitProvider } from "../components";

const pendingTransactionsAtom = atom<{}>({});

function Component() {
  return (
    <DexkitProvider
      locale="en-US"
      theme={createTheme()}
      defaultLocale="en-US"
      pendingTransactionsAtom={pendingTransactionsAtom}
    >
      <h1>hello</h1>
    </DexkitProvider>
  );
}

export default {
  title: "Components/Magic",
  component: Component,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof Component>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Component> = (args) => <Component />;

export const Default = Template.bind({});
Default.args = {};
