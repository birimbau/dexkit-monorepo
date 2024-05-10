import { ChainId } from "@dexkit/core/constants";
import { WRAPPED_TOKEN_ADDRESS } from "@dexkit/core/constants/networks";
import { Token } from "@dexkit/core/types";
import { UseMutationResult } from "@tanstack/react-query";
import { Transak } from "@transak/transak-sdk";
import { Connector } from "@web3-react/types";
import { BigNumber, constants, providers, utils } from "ethers";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { useAsyncMemo, useDebounce, useRecentTokens, useTokenBalance, useWrapToken } from "../../../hooks";
import { useSignTypeData } from "../../../hooks/useSignTypeData";
import { hasSufficientAllowance } from "../../../services";
import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "../../../services/zeroex/constants";
import { ZeroExQuoteMetaTransactionResponse, ZeroExQuoteResponse } from "../../../services/zeroex/types";
import { isAddressEqual, switchNetwork } from "../../../utils";
import { ExecSwapState } from "../constants/enum";
import { SUPPORTED_SWAP_CHAIN_IDS } from "../constants/supportedChainIds";
import { ExecType, NotificationCallbackParams, SwapSide } from "../types";
import { SwapExecParams } from "./useSwapExec";
import { SwapGaslessExecParams } from "./useSwapGaslessExec";
import { useSwapQuote } from "./useSwapQuote";


export function useSwapState({
  execMutation,
  approveMutation,
  provider,
  defaultSellToken,
  defaultBuyToken,
  connector,
  connectorProvider,
  selectedChainId: chainId,
  connectedChainId,
  account,
  swapFees,
  isGasless,
  isActive,
  isActivating,
  disableFooter,
  zeroExApiKey,
  maxSlippage,
  isAutoSlippage,
  transakApiKey,
  onChangeNetwork,
  onNotification,
  onConnectWallet,
  onShowTransactions,
  execGaslessMutation
}: {
  zeroExApiKey?: string;
  execMutation: UseMutationResult<
    providers.TransactionReceipt,
    unknown,
    SwapExecParams,
    unknown
  >;
  execGaslessMutation: UseMutationResult<
    string, unknown, SwapGaslessExecParams, unknown
  >;
  approveMutation: UseMutationResult<
    unknown,
    unknown,
    {
      spender: string;
      amount: BigNumber;
      tokenAddress?: string;
      provider?: providers.Web3Provider;
      token: Token;
    },
    unknown
  >;
  swapFees?: {
    recipient: string;
    amount_percentage: number;
  };
  disableFooter?: boolean;
  enableBuyCryptoButton?: boolean;
  provider?: providers.BaseProvider;
  connectorProvider?: providers.Web3Provider;
  connector?: Connector;
  isGasless?: boolean;
  isActive?: boolean;
  isActivating?: boolean;
  account?: string;
  selectedChainId?: ChainId;
  connectedChainId?: ChainId;
  defaultSellToken?: Token;
  defaultBuyToken?: Token;
  transakApiKey?: string;
  onChangeNetwork: (chainId: ChainId) => void;
  onNotification: (params: NotificationCallbackParams) => void;
  onConnectWallet: () => void;
  onShowTransactions: () => void;
  maxSlippage: number;
  isAutoSlippage: boolean;
}) {
  const transak = useMemo(() => {
    if (transakApiKey) {
      return new Transak({
        apiKey: transakApiKey, // (Required)
        environment: Transak.ENVIRONMENTS.PRODUCTION
      });
    }
  }, [transakApiKey]);



  const { wrapMutation, unwrapMutation } = useWrapToken({ onNotification });

  const [showSelect, setShowSelectToken] = useState(false);

  const [execSwapState, setExecSwapState] = useState(ExecSwapState.quote);

  const [quoteFor, setQuoteFor] = useState<SwapSide>();
  const [clickOnMax, setClickOnMax] = useState<boolean>(false);

  const [sellToken, setSellToken] = useState<Token | undefined>();
  const [buyToken, setBuyToken] = useState<Token | undefined>();

  useEffect(() => {
    setSellToken(defaultSellToken);
    setBuyToken(defaultBuyToken);
  }, [defaultBuyToken, defaultSellToken, chainId, connectedChainId]);

  const [sellAmount, setSellAmount] = useState<BigNumber>(BigNumber.from(0));
  const [buyAmount, setBuyAmount] = useState<BigNumber>(BigNumber.from(0));
  const [selectSide, setSelectSide] = useState<SwapSide>();

  const [showSettings, setShowSettings] = useState(false);

  const lazySellToken = useDebounce<Token | undefined>(sellToken, 0);
  const lazyBuyToken = useDebounce<Token | undefined>(buyToken, 0);
  const lazySellAmount = useDebounce<BigNumber>(sellAmount, 200);
  const lazyBuyAmount = useDebounce<BigNumber>(buyAmount, 200);
  const lazyQuoteFor = useDebounce<SwapSide>(quoteFor, 0);

  const [showConfirmSwap, setShowConfirmSwap] = useState(false);

  const sellTokenBalance = useTokenBalance({
    provider,
    account,
    contractAddress: lazySellToken?.address,
  });

  const buyTokenBalance = useTokenBalance({
    provider,
    account,
    contractAddress: lazyBuyToken?.address,
  });

  const handleQuoteSuccess = useCallback(
    (data?: [string, ZeroExQuoteResponse | null]) => {
      if (data) {
        const [quotedFor, quote] = data;

        if (quotedFor === "buy" && quote) {
          setSellAmount(BigNumber.from(quote?.sellAmount));
        } else if (quotedFor === "sell" && quote) {
          setBuyAmount(BigNumber.from(quote?.buyAmount));
        }
      }
    },
    [quoteFor]
  );

  const quote = useSwapQuote({
    onSuccess: handleQuoteSuccess,
    maxSlippage: !isAutoSlippage ? maxSlippage : undefined,
    zeroExApiKey,
    isGasless,
    swapFees,
    params: {
      chainId: chainId as ChainId,
      sellToken: lazySellToken,
      buyToken: lazyBuyToken,
      sellTokenAmount: lazySellAmount,
      buyTokenAmount: lazyBuyAmount,
      quoteFor: lazyQuoteFor,
      account,
    },
  });

  const { quoteQuery } = quote;


  const signTypeDataMutation = useSignTypeData()

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  const handleShowSettings = () => {
    setShowSettings(true);
  };

  const handleSwapTokens = useCallback(() => {
    const sell = sellToken;
    const buy = buyToken;

    const sellValue = sellAmount;
    const buyValue = buyAmount;

    if (quote.params?.quoteFor === "buy") {
      setSellAmount(buyValue);
      setBuyAmount(BigNumber.from(0));
      setQuoteFor("sell");
    } else if (quote.params?.quoteFor === "sell") {
      setBuyAmount(sellValue);
      setSellAmount(BigNumber.from(0));
      setQuoteFor("buy");
    }

    setSellToken(buy);
    setBuyToken(sell);
  }, [sellToken, buyToken, sellAmount, buyAmount, quote.params?.quoteFor]);

  const handleOpenSelectToken = (selectFor: SwapSide, token?: Token) => {
    setSelectSide(selectFor);
    setShowSelectToken(true);
  };

  const recentTokens = useRecentTokens();

  const handleSelectToken = (token: Token) => {
    recentTokens.add(token);

    if (selectSide === "sell") {
      if (
        token.chainId === buyToken?.chainId &&
        isAddressEqual(token.address, buyToken?.address)
      ) {
        handleSwapTokens();
      } else {
        setSellToken(token);
      }
    } else {
      if (
        token.chainId === sellToken?.chainId &&
        isAddressEqual(token.address, sellToken?.address)
      ) {
        handleSwapTokens();
      } else {
        setBuyToken(token);
      }
    }

    setSelectSide(undefined);
    setShowSelectToken(false);
  };

  const handleClearRecentTokens = () => {
    recentTokens.clear();
  };

  const handleChangeBuyAmount = useCallback(
    (value: BigNumber, clickMax?: boolean) => {
      setQuoteFor("buy");
      if (buyToken) {
        if (clickMax) {
          setClickOnMax(true);
        } else {
          setClickOnMax(false);
        }
        setBuyAmount(value);
      }
    },
    [buyToken]
  );

  const handleChangeSellAmount = useCallback(
    (value: BigNumber, clickMax?: boolean) => {
      setQuoteFor("sell");
      if (sellToken) {
        if (clickMax) {
          setClickOnMax(true);
        } else {
          setClickOnMax(false);
        }
        setSellAmount(value);
      }
    },
    [sellToken]
  );

  const handleConnectWallet = () => {
    onConnectWallet();
  };

  const handleShowTransactions = () => {
    onShowTransactions();
  };

  const handleCloseSelectToken = () => {
    setShowSelectToken(false);
  };

  const handleCloseConfirmSwap = () => {
    setShowConfirmSwap(false);
    quote.setSkipValidation(true);
    quote.setIntentOnFilling(false);
    setExecSwapState(ExecSwapState.quote)
  };

  const handleChangeNetwork = async (newChainId: ChainId) => {
    onChangeNetwork(newChainId);
    setQuoteFor(undefined);
    setSellAmount(BigNumber.from(0));
    setBuyAmount(BigNumber.from(0));
    setSellToken(undefined);
    setBuyToken(undefined);
  };

  const isProviderReady = useAsyncMemo<boolean>(
    async (initial) => {
      if (provider) {
        await provider.ready;

        return true;
      }

      return initial;
    },
    false,
    [provider]
  );

  const execType: ExecType = useAsyncMemo<ExecType>(
    async (initial) => {
      let result: ExecType = initial;
      if (connectedChainId && chainId && chainId !== connectedChainId) {
        return "switch";
      }

      if (chainId && !SUPPORTED_SWAP_CHAIN_IDS.includes(chainId as unknown as number)) {
        return 'network_not_supported'
      }

      const isBuyTokenWrapped =
        lazyBuyToken &&
        chainId &&
        isAddressEqual(WRAPPED_TOKEN_ADDRESS(chainId), lazyBuyToken.address);

      const isSellTokenWrapped =
        lazySellToken &&
        chainId &&
        isAddressEqual(WRAPPED_TOKEN_ADDRESS(chainId), lazySellToken.address);

      if (lazyBuyToken && lazySellToken && quoteQuery.data) {
        if (!isBuyTokenWrapped && !isSellTokenWrapped) {
          if (account) {
            if (isGasless) {
              const [, data] = quoteQuery.data as unknown as [string, ZeroExQuoteMetaTransactionResponse];
              if (data && data?.approval && data?.approval?.isRequired && data?.approval?.isGaslessAvailable) {
                const { isRequired, isGaslessAvailable } = data.approval
                if (isRequired && isGaslessAvailable) {
                  return 'approve_gasless';
                }
                if (isRequired) {
                  return 'approve';
                }
              }
            } else {
              const [, data] = quoteQuery.data;
              if (data) {
                const sufficientAllowance = await hasSufficientAllowance({
                  spender: data.allowanceTarget,
                  tokenAddress: data.sellTokenAddress,
                  amount: BigNumber.from(data.sellAmount),
                  provider,
                  account,
                });

                if (!sufficientAllowance) {
                  return "approve";
                }
              }
            }
          }
        }

        return isGasless ? 'swap_gasless' : 'swap';
      }

      result =
        isBuyTokenWrapped &&
          isAddressEqual(lazySellToken?.address, ZEROEX_NATIVE_TOKEN_ADDRESS)
          ? "wrap"
          : isSellTokenWrapped &&
            isAddressEqual(lazyBuyToken?.address, ZEROEX_NATIVE_TOKEN_ADDRESS)
            ? "unwrap"
            : isGasless ? 'swap_gasless' : 'swap';

      return result;
    },
    "quote",
    [
      provider,
      connectedChainId,
      lazyBuyToken,
      lazySellToken,
      quoteQuery.data,
      account,
      lazySellAmount,
      chainId,
      isGasless
    ]
  );

  const { enqueueSnackbar } = useSnackbar();

  const { formatMessage } = useIntl();

  const handleConfirmExecSwap = async () => {
    if (isGasless && quote.quoteQuery.data && sellToken && buyToken && connectedChainId) {
      const [, data] = quoteQuery.data as unknown as [string, ZeroExQuoteMetaTransactionResponse];
      const { eip712: eip712Approval, isRequired, isGaslessAvailable, type: approvalType } = data.approval
      let trade;
      let approval;


      if (isRequired && isGaslessAvailable) {
        setExecSwapState(ExecSwapState.gasless_approval)
        const signature = await signTypeDataMutation.mutateAsync({ domain: eip712Approval.domain, types: eip712Approval.types, value: eip712Approval.message, primaryType: eip712Approval.primaryType },
          {
            onSuccess: (signature: string | null) => {
              if (signature) {
                quote.setApprovalSignature(signature);
              }
            }
          })
        if (signature) {
          const sign = utils.splitSignature(signature);
          approval = {
            type: approvalType,
            eip712: eip712Approval,
            signature: {
              v: sign.v,
              r: sign.r,
              s: sign.s,
              signatureType: 2
            }
          }
        }
      }

      const { eip712, type } = data.trade
      setExecSwapState(ExecSwapState.gasless_trade)
      const signature = await signTypeDataMutation.mutateAsync({ domain: eip712.domain, types: eip712.types, value: eip712.message, primaryType: eip712.primaryType }, {
        onSuccess: (signature: string | null) => {
          if (signature) {
            quote.setTradeSignature(signature);
          }
        }
      })

      if (signature) {
        const sign = utils.splitSignature(signature);
        trade = {
          type: type,
          eip712: eip712,
          signature: {
            v: sign.v,
            r: sign.r,
            s: sign.s,
            signatureType: 2
          }
        }
      }
      setExecSwapState(ExecSwapState.gasless_trade_submit)
      await execGaslessMutation.mutateAsync({
        trade, approval, quote: data, onHash: (hash: string) => { }, sellToken, buyToken, chainId: connectedChainId
      })
      handleCloseConfirmSwap();
      setExecSwapState(ExecSwapState.quote)


    } else if (quoteQuery.data) {
      const onError = async (err: unknown) => {
        enqueueSnackbar(
          formatMessage({
            id: "transaction.rejected",
            defaultMessage: "Transaction rejected",
          }),
          { variant: "error" }
        );
      };

      handleCloseConfirmSwap();

      try {
        const [, data] = quoteQuery.data;
        if (data && sellToken && buyToken) {
          await execMutation.mutateAsync(
            {
              quote: data,
              provider: connectorProvider as providers.Web3Provider,
              onHash: (hash: string) => { },
              sellToken,
              buyToken,
            },
            {
              onSuccess: (receipt: providers.TransactionReceipt) => { },
              onError,
            }
          );
        }
      } catch (err: unknown) { }
    }
  };

  const handleShowTransak = () => {
    if (transak) {
      transak.init();
    }
  };

  const handleExecSwap = useCallback(async () => {
    if (execType === "swap" && quoteQuery.data) {
      setShowConfirmSwap(true);
      quote.setSkipValidation(false);
      quote.setIntentOnFilling(true);

      quote.quoteQuery.refetch();
    } else if (execType === "swap_gasless" && quoteQuery.data) {
      setShowConfirmSwap(true);
      quote.setIntentOnFilling(true);
      quote.quoteQuery.refetch();
      setExecSwapState(ExecSwapState.gasless_trade)
      /* const [, data] = quoteQuery.data as unknown as [string, ZeroExQuoteMetaTransactionResponse];
       const { eip712 } = data.trade
       await signTypeDataMutation.mutateAsync({ domain: eip712.domain, types: eip712.types, value: eip712.message }, {
         onSuccess: (signature: string | null) => {
           if (signature) {
             quote.setTradeSignature(signature);
           }
         }
       })*/

    } else if (execType === "approve_gasless" && quoteQuery.data) {
      setShowConfirmSwap(true);
      quote.setIntentOnFilling(true);
      setExecSwapState(ExecSwapState.gasless_approval)
      quote.quoteQuery.refetch();
      /*const [, data] = quoteQuery.data as unknown as [string, ZeroExQuoteMetaTransactionResponse];
      const { eip712 } = data.approval
      await signTypeDataMutation.mutateAsync({ domain: eip712.domain, types: eip712.types, value: eip712.message },
        {
          onSuccess: (signature: string | null) => {
            if (signature) {
              quote.setApprovalSignature(signature);
            }
          }
        })*/
    } else if (execType === "wrap") {
      await wrapMutation.mutateAsync(
        {
          provider: connectorProvider as providers.Web3Provider,
          amount: lazySellAmount,
          onHash: (hash: string) => { },
        },
        {
          onSuccess: (receipt: providers.TransactionReceipt) => { },
        }
      );
    } else if (execType === "approve" && quoteQuery.data) {
      const [, data] = quoteQuery.data;

      if (data && sellToken) {
        await approveMutation.mutateAsync(
          {
            spender: data.allowanceTarget,
            provider: connectorProvider as providers.Web3Provider,
            tokenAddress: data.sellTokenAddress,
            amount: constants.MaxUint256,
            token: sellToken,
          },
          {
            onSuccess: () => { },
          }
        );
      }
    } else if (execType === "unwrap") {
      await unwrapMutation.mutateAsync(
        {
          provider: connectorProvider as providers.Web3Provider,
          amount: lazySellAmount,
          onHash: (hash: string) => { },
        },
        {
          onSuccess: (receipt: providers.TransactionReceipt) => {
            quoteQuery.refetch();
          },
        }
      );
    } else if (execType === "switch" && connector && chainId) {
      switchNetwork(connector, chainId);
    }
  }, [
    quoteQuery.data,
    execType,
    lazySellAmount,
    sellToken,
    chainId,
    connector,
    connectorProvider,
  ]);

  /*useEffect(() => {
    if (
      lazySellToken &&
      lazyBuyToken &&
      lazyQuoteFor &&
      (lazySellAmount || lazyBuyAmount)
    ) {
      if (execType === "wrap" || execType === "unwrap") {
        setBuyAmount(lazySellAmount);
      } else if (lazyQuoteFor) {
        if (!quote.enabled) {
          quote.setEnabled(true);
        }
      }
    }

  }, [
    quote,
    lazyQuoteFor,
    lazySellAmount,
    lazyBuyAmount,
    lazySellToken,
    lazyBuyToken,
    execType,
  ]);*/

  const quoteData = useMemo(() => {
    if (quoteQuery.data) {
      const [, data] = quoteQuery.data;

      return data;
    }
  }, [quoteQuery.data]);

  return {
    chainId,
    buyToken: lazyBuyToken,
    sellToken: lazySellToken,
    showSelect,
    selectSide,
    execType,
    sellAmount: lazySellAmount,
    buyAmount: lazyBuyAmount,
    quoteFor: quote.params?.quoteFor,
    insufficientBalance: lazySellAmount?.gt(
      sellTokenBalance.data ?? BigNumber.from(0)
    ),
    clickOnMax,
    isExecuting:
      wrapMutation.isLoading ||
      unwrapMutation.isLoading ||
      execMutation.isLoading ||
      approveMutation.isLoading,
    quote: quoteData,
    isQuoting: quoteQuery.isFetching,
    sellTokenBalance: sellTokenBalance.data,
    buyTokenBalance: buyTokenBalance.data,
    showConfirmSwap,
    isLoadingSignGasless: signTypeDataMutation.isLoading,
    showSettings,
    isProviderReady,
    recentTokens: recentTokens.tokens,
    setQuoteFor,
    execSwapState,
    setSellAmount,
    setBuyAmount,
    handleConnectWallet,
    handleOpenSelectToken,
    handleSelectToken,
    setBuyToken,
    setSellToken,
    handleSwapTokens,
    handleChangeSellAmount,
    handleChangeBuyAmount,
    handleExecSwap,
    handleCloseSelectToken,
    handleCloseConfirmSwap,
    handleConfirmExecSwap,
    handleChangeNetwork,
    handleCloseSettings,
    handleShowSettings,
    handleShowTransactions,
    handleClearRecentTokens,
    handleShowTransak,
  };
}