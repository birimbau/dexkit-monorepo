import Swap from "./Swap";

import { useWeb3React } from "@web3-react/core";
import { useMemo, useState } from "react";
import { GET_NATIVE_TOKEN } from "../../constants";
import { ChainId } from "../../constants/enum";
import { NETWORKS } from "../../constants/networks";
import { usePlatformCoinSearch } from "../../hooks/api";
import { apiCoinToTokens } from "../../utils/api";
import SwapConfirmDialog from "./dialogs/SwapConfirmDialog";
import SwapSettingsDialog from "./dialogs/SwapSettingsDialog";

// declare global {
//   function renderSwapWidget(id: string, options: RenderOptions): void;
// }

import {
  useErc20ApproveMutation,
  useSwapExec,
  useSwapProvider,
  useSwapState,
} from "./hooks";
import SwapSelectCoinDialog from "./SwapSelectCoinDialog";
import { NotificationCallbackParams, RenderOptions } from "./types";

export interface SwapWidgetProps {
  renderOptions: RenderOptions;
  onNotification: ({
    title,
    hash,
    chainId,
  }: NotificationCallbackParams) => void;
  onConnectWallet: () => void;
  onShowTransactions: () => void;
}

export function SwapWidget({
  renderOptions: options,
  onNotification,
  onConnectWallet,
  onShowTransactions,
}: SwapWidgetProps) {
  const { provider, connector, account, isActive, isActivating } =
    useWeb3React();

  const {
    configsByChain,
    defaultChainId,
    disableNotificationsButton,
    transakApiKey,
    currency,
  } = options;

  const execSwapMutation = useSwapExec({ onNotification });

  const [selectedChainId, setSelectedChainId] = useState<ChainId>(
    defaultChainId ? defaultChainId : ChainId.Ethereum
  );

  const isAutoSlippage = !(selectedChainId && configsByChain[selectedChainId]);

  const maxSlippage =
    selectedChainId && configsByChain[selectedChainId]
      ? configsByChain[selectedChainId].slippage
      : 0;

  const swapProvider = useSwapProvider({
    provider,
    defaultChainId: selectedChainId,
  });

  const approveMutation = useErc20ApproveMutation({ onNotification });

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
    showSettings,
    isQuoting,
    isProviderReady,
    recentTokens,
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
    handleShowSettings,
    handleCloseSettings,
    handleShowTransactions,
    handleClearRecentTokens,
    handleShowTransak,
  } = useSwapState({
    execMutation: execSwapMutation,
    approveMutation,
    provider: swapProvider,
    onChangeNetwork: handleChangeSelectedNetwork,
    onNotification,
    onConnectWallet,
    onShowTransactions,
    connector,
    account,
    isActive,
    isActivating,
    maxSlippage,
    isAutoSlippage,
    defaultBuyToken:
      selectedChainId && configsByChain[selectedChainId]
        ? configsByChain[selectedChainId].buyToken
        : undefined,
    defaultSellToken:
      selectedChainId && configsByChain[selectedChainId]
        ? configsByChain[selectedChainId].sellToken
        : undefined,
  });

  const [query, setQuery] = useState("");

  const searchQuery = usePlatformCoinSearch({
    keyword: query,
    network: chainId && NETWORKS[chainId] ? NETWORKS[chainId].slug : undefined,
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
          recentTokens={recentTokens?.filter((t) => t.chainId === chainId)}
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
          onClearRecentTokens={handleClearRecentTokens}
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
      <SwapSettingsDialog
        DialogProps={{
          open: showSettings,
          maxWidth: "xs",
          fullWidth: true,
          onClose: handleCloseSettings,
        }}
        onAutoSlippage={() => {}}
        onChangeSlippage={() => {}}
        maxSlippage={maxSlippage}
        isAutoSlippage={isAutoSlippage}
      />
      <Swap
        currency={"usd"}
        disableNotificationsButton={disableNotificationsButton}
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
        isQuoting={isQuoting}
        provider={provider}
        isProviderReady={isProviderReady}
        sellTokenBalance={sellTokenBalance}
        insufficientBalance={insufficientBalance}
        buyTokenBalance={buyTokenBalance}
        onChangeNetwork={handleChangeNetwork}
        onShowSettings={handleShowSettings}
        onShowTransactions={handleShowTransactions}
        onShowTransak={transakApiKey ? handleShowTransak : undefined}
      />
    </>
  );
}

// globalThis.renderSwapWidget = function renderSwapWidget(
//   id: string,
//   options: RenderOptions
// ) {
//   const container = document.getElementById(id);

//   const root = createRoot(container!); // createRoot(container!) if you use TypeScript

//   root.render(
//     <DexkitContextProvider>
//       {({
//         handleNotification,
//         handleConnectWallet,
//         handleShowTransactions,
//       }) => (
//         <SwapWidget
//           renderOptions={options}
//           onNotification={handleNotification}
//           onConnectWallet={handleConnectWallet}
//           onShowTransactions={handleShowTransactions}
//         />
//       )}
//     </DexkitContextProvider>
//   );
// };
