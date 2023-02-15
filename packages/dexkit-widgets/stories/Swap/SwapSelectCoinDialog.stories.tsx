import { ComponentMeta, ComponentStory } from "@storybook/react";
import DexkitContextProvider from "../../src/components/DexkitContextProvider";
import { Token } from "../../src/types";
import SwapSelectCoinDialog, {
  SwapSelectCoinDialogProps,
} from "../../src/widgets/swap/SwapSelectCoinDialog";
import { TEST_TOKENS } from "../SelectCoinList/constants";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Example/SwapSelectCoinDialog",
  component: SwapSelectCoinDialog,
} as ComponentMeta<typeof SwapSelectCoinDialog>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SwapSelectCoinDialog> = (
  args: SwapSelectCoinDialogProps
) => {
  const handleChange = (value: string) => {};

  const handleSelect = (token: Token) => {};

  return (
    <DexkitContextProvider>
      {({}) => (
        <SwapSelectCoinDialog
          {...args}
          onQueryChange={handleChange}
          onSelect={handleSelect}
        />
      )}
    </DexkitContextProvider>
  );
};

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Default.args = {
  DialogProps: { open: true, maxWidth: "sm", fullWidth: true },
  tokens: TEST_TOKENS,
};

// export const Secondary = Template.bind({});
// Secondary.args = {
//   label: 'Button',
// };
