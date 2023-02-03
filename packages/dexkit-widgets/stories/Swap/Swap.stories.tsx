import { Grid } from "@mui/material";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useWeb3React } from "@web3-react/core";
import DexkitContextProvider from "../../src/components/DexkitContextProvider";
import {
  useErc20ApproveMutation,
  useSwapExec,
  useSwapState,
} from "../../src/widgets/swap/hooks";
import Swap, { SwapProps } from "../../src/widgets/swap/Swap";
import SwapSelectCoinDialog from "../../src/widgets/swap/SwapSelectCoinDialog";
import { TEST_TOKENS } from "../SelectCoinList/constants";

const Component = ({ args }: { args: SwapProps }) => {
  const { provider, connector, account } = useWeb3React();

  const execSwapMutation = useSwapExec();
  const approveMutation = useErc20ApproveMutation({});

  const {
    buyToken,
    sellToken,
    showSelect,
    sellAmount,
    buyAmount,
    execType,
    isExecuting,
    quote,
    buyTokenBalance,
    sellTokenBalance,
    insufficientBalance,
    handleConnectWallet,
    handleOpenSelectToken,
    handleSwapTokens,
    handleSelectToken,
    handleChangeSellAmount,
    handleChangeBuyAmount,
    handleExecSwap,
  } = useSwapState({
    execMutation: execSwapMutation,
    approveMutation,
    provider,
    connector,
    account,
  });

  const handleQueryChange = (value: string) => {};

  const { isActive } = useWeb3React();

  return (
    <>
      <SwapSelectCoinDialog
        tokens={TEST_TOKENS}
        onQueryChange={handleQueryChange}
        onSelect={handleSelectToken}
        DialogProps={{ open: showSelect, maxWidth: "sm", fullWidth: true }}
      />

      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={3}>
          <Swap
            {...args}
            isActive={isActive}
            buyToken={buyToken}
            sellToken={sellToken}
            onSelectToken={handleOpenSelectToken}
            onSwapTokens={handleSwapTokens}
            onConnectWallet={handleConnectWallet}
            sellAmount={sellAmount}
            buyAmount={buyAmount}
            onChangeBuyAmount={handleChangeBuyAmount}
            onChangeSellAmount={handleChangeSellAmount}
            onExec={handleExecSwap}
            execType={execType}
            isExecuting={isExecuting}
            quote={quote}
            provider={provider}
            sellTokenBalance={sellTokenBalance}
            insufficientBalance={insufficientBalance}
            buyTokenBalance={buyTokenBalance}
          />
        </Grid>
      </Grid>
    </>
  );
};

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Example/Swap",
  component: Swap,
} as ComponentMeta<typeof Swap>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Swap> = (args: SwapProps) => {
  return (
    <DexkitContextProvider>
      <Component args={args} />
    </DexkitContextProvider>
  );
};

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Default.args = {};

// export const Secondary = Template.bind({});
// Secondary.args = {
//   label: 'Button',
// };
