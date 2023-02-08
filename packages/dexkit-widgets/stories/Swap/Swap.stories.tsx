import { Grid } from "@mui/material";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useWeb3React } from "@web3-react/core";
import { useMemo, useState } from "react";
import DexkitContextProvider from "../../src/components/DexkitContextProvider";
import { GET_NATIVE_TOKEN } from "../../src/constants";
import { ChainId } from "../../src/constants/enum";
import { usePlatformCoinSearch } from "../../src/hooks/api";
import { apiCoinToTokens } from "../../src/utils/api";
import SwapConfirmDialog from "../../src/widgets/swap/dialogs/SwapConfirmDialog";
import {
  useErc20ApproveMutation,
  useSwapExec,
  useSwapProvider,
  useSwapState,
} from "../../src/widgets/swap/hooks";
import Swap, { SwapProps } from "../../src/widgets/swap/Swap";
import SwapSelectCoinDialog from "../../src/widgets/swap/SwapSelectCoinDialog";

const Component = ({ args }: { args: SwapProps }) => {
  const { provider, connector, account, isActive, isActivating } =
    useWeb3React();

  const execSwapMutation = useSwapExec();

  const [selectedChainId, setSelectedChainId] = useState<ChainId>(
    ChainId.Ethereum
  );

  const swapProvider = useSwapProvider({
    provider,
    defaultChainId: selectedChainId,
  });

  const approveMutation = useErc20ApproveMutation({});

  const [query, setQuery] = useState("");

  const searchQuery = usePlatformCoinSearch({
    keyword: query,
    network: "ethereum",
  });

  const handleChangeSelectedNetwork = (chainId: ChainId) => {
    setSelectedChainId(chainId);
  };

  const {
    chainId,
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
    showConfirmSwap,
    handleConnectWallet,
    handleOpenSelectToken,
    handleSwapTokens,
    handleSelectToken,
    handleChangeSellAmount,
    handleChangeBuyAmount,
    handleExecSwap,
    handleConfirmExecSwap,
    handleCloseSelectToken,
    handleCloseConfirmSwap,
    handleChangeNetwork,
  } = useSwapState({
    execMutation: execSwapMutation,
    approveMutation,
    provider: swapProvider,
    onChangeNetwork: handleChangeSelectedNetwork,
    connector,
    account,
    isActive,
    isActivating,
  });

  const tokens = useMemo(() => {
    if (searchQuery.data && chainId) {
      let tokens = [
        GET_NATIVE_TOKEN(chainId),
        ...apiCoinToTokens(searchQuery.data),
      ];

      if (query !== "") {
        tokens = tokens.filter(
          (c) =>
            c.name.toLowerCase().search(query?.toLowerCase()) > -1 ||
            c.symbol.toLowerCase().search(query?.toLowerCase()) > -1 ||
            c.contractAddress.toLowerCase().search(query?.toLowerCase()) > -1
        );
      }

      return tokens;
    }

    return [];
  }, [searchQuery.data, chainId, query]);

  const handleQueryChange = (value: string) => setQuery(value);

  return (
    <>
      {chainId && (
        <SwapSelectCoinDialog
          tokens={tokens}
          onQueryChange={handleQueryChange}
          onSelect={handleSelectToken}
          DialogProps={{
            open: showSelect,
            maxWidth: "sm",
            fullWidth: true,
            onClose: handleCloseSelectToken,
          }}
          account={account}
          provider={swapProvider}
        />
      )}

      <SwapConfirmDialog
        DialogProps={{
          open: showConfirmSwap,
          maxWidth: "xs",
          fullWidth: true,
          onClose: handleCloseConfirmSwap,
        }}
        quote={quote}
        onConfirm={handleConfirmExecSwap}
        chainId={chainId}
      />

      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={3}>
          <Swap
            {...args}
            chainId={chainId}
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
            onChangeNetwork={handleChangeNetwork}
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
