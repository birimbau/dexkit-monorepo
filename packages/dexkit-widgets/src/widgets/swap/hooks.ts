import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import { Connector } from "@web3-react/types";
import { BigNumber, ethers, providers } from "ethers";
import { useSetAtom } from "jotai";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { showConnectWalletAtom } from "../../components/atoms";
import { ERC20Abi } from "../../constants/abis";
import { ChainId } from "../../constants/enum";
import { NETWORKS } from "../../constants/networks";
import {
  useAsyncMemo,
  useDebounce,
  useTokenBalance,
  useWrapToken,
} from "../../hooks";
import { hasSufficientAllowance } from "../../services";
import { ZeroExApiClient } from "../../services/zeroex";
import {
  ZEROEX_AFFILIATE_ADDRESS,
  ZEROEX_FEE_RECIPIENT,
  ZEROEX_NATIVE_TOKEN_ADDRESS,
} from "../../services/zeroex/constants";
import { ZeroExQuote, ZeroExQuoteResponse } from "../../services/zeroex/types";
import { Token } from "../../types";
import { isAddressEqual, switchNetwork } from "../../utils";
import { ExecType, SwapSide, SwapState } from "./types";

export function useErc20ApproveMutation(
  options?: Omit<UseMutationOptions, any>
) {
  const mutation = useMutation(
    async ({
      spender,
      amount,
      tokenAddress,
      provider,
    }: {
      spender: string;
      amount: ethers.BigNumber;
      tokenAddress?: string;
      provider?: ethers.providers.Web3Provider;
    }) => {
      if (!provider || tokenAddress === undefined) {
        return undefined;
      }

      const contract = new ethers.Contract(
        tokenAddress,
        ERC20Abi,
        provider.getSigner()
      );

      const tx = await contract.approve(spender, amount);

      return await tx.wait();
    },
    options
  );

  return mutation;
}

export interface SwapQuoteParams {
  sellToken?: Token;
  sellTokenAmount?: BigNumber;
  buyToken?: Token;
  buyTokenAmount?: BigNumber;
  chainId: ChainId;
  skipValidation?: boolean;
  quoteFor?: SwapSide;
  account?: string;
}

export interface UseQuoteSwap {
  enabled: boolean;
  setParams: React.Dispatch<React.SetStateAction<SwapQuoteParams | undefined>>;
  setSkipValidation: React.Dispatch<React.SetStateAction<boolean>>;
  params: SwapQuoteParams | undefined;
  setEnabled: React.Dispatch<boolean>;
  quoteQuery: UseQueryResult<ZeroExQuoteResponse | null | undefined, unknown>;
}

export const SWAP_QUOTE = "SWAP_QUOTE";

export function useSwapQuote({
  onSuccess,
}: {
  onSuccess: (data: ZeroExQuoteResponse | null | undefined) => void;
}): UseQuoteSwap {
  const [params, setParams] = useState<SwapQuoteParams>();
  const [enabled, setEnabled] = useState(true);
  const [skipValidation, setSkipValidation] = useState(true);

  const quoteQuery = useQuery(
    [SWAP_QUOTE, params],
    async ({ signal }) => {
      if (!params) {
        return;
      }

      const {
        account,
        chainId,
        buyToken,
        sellToken,
        sellTokenAmount,
        buyTokenAmount,
        skipValidation: canSkipValitaion,
        quoteFor,
      } = { ...params, skipValidation };

      const client = new ZeroExApiClient(chainId);

      if (buyToken && sellToken && quoteFor) {
        const quoteParam: ZeroExQuote = {
          buyToken: buyToken?.contractAddress,
          sellToken: sellToken?.contractAddress,

          affiliateAddress: ZEROEX_AFFILIATE_ADDRESS,
          slippagePercentage: 0.03,
          feeRecipient: ZEROEX_FEE_RECIPIENT,
          skipValidation: canSkipValitaion,
        };

        if (account && !skipValidation) {
          quoteParam.takerAddress = account;
        }

        if (quoteFor === "buy" && buyTokenAmount?.gt(0)) {
          quoteParam.buyAmount = buyTokenAmount?.toString();
          return await client.quote(quoteParam, { signal });
        } else if (quoteFor === "sell" && sellTokenAmount?.gt(0)) {
          quoteParam.sellAmount = sellTokenAmount?.toString();
          return await client.quote(quoteParam, { signal });
        }
      }

      return null;
    },
    { enabled: Boolean(params) && enabled, refetchInterval: 10000, onSuccess }
  );

  return {
    enabled,
    setParams,
    params,
    setEnabled,
    quoteQuery,
    setSkipValidation,
  };
}

export interface SwapExecParams {
  quote: ZeroExQuoteResponse;
  provider?: ethers.providers.Web3Provider;
  onHash: (hash: string) => void;
}

export function useSwapExec() {
  return useMutation(async ({ quote, provider, onHash }: SwapExecParams) => {
    if (!provider) {
      throw new Error("no provider");
    }

    const maxFeePerGas = (await provider.getFeeData()).maxFeePerGas;
    const maxPriorityFeePerGas = (await provider.getFeeData())
      .maxPriorityFeePerGas;

    if (!maxFeePerGas || !maxPriorityFeePerGas) {
      throw new Error("no max fee per gas");
    }

    const tx = await provider.getSigner().sendTransaction({
      data: quote?.data,
      value: ethers.BigNumber.from(quote?.value),
      to: quote?.to,
    });

    onHash(tx.hash);

    return await tx.wait();
  });
}

export function useSwapState({
  execMutation,
  approveMutation,
  provider,
  connector,
  account,
  isActive,
  isActivating,
  onChangeNetwork,
}: {
  execMutation: UseMutationResult<
    ethers.providers.TransactionReceipt,
    unknown,
    SwapExecParams,
    unknown
  >;
  approveMutation: UseMutationResult<
    unknown,
    unknown,
    {
      spender: string;
      amount: BigNumber;
      tokenAddress?: string;
      provider?: ethers.providers.Web3Provider;
    },
    unknown
  >;
  provider?: ethers.providers.BaseProvider;
  connector?: Connector;
  isActive?: boolean;
  isActivating?: boolean;
  account?: string;
  onChangeNetwork: (chainId: ChainId) => void;
}): SwapState {
  const { wrapMutation, unwrapMutation } = useWrapToken();

  const [showSelect, setShowSelectToken] = useState(false);

  const [quoteFor, setQuoteFor] = useState<SwapSide>();
  const [sellToken, setSellToken] = useState<Token>();
  const [buyToken, setBuyToken] = useState<Token>();
  const [sellAmount, setSellAmount] = useState<BigNumber>(BigNumber.from(0));
  const [buyAmount, setBuyAmount] = useState<BigNumber>(BigNumber.from(0));
  const [selectSide, setSelectSide] = useState<SwapSide>();

  const lazySellAmount = useDebounce<BigNumber>(sellAmount, 500);
  const lazyBuyAmount = useDebounce<BigNumber>(buyAmount, 500);
  const lazyQuoteFor = useDebounce<SwapSide>(quoteFor, 500);
  const lazySellToken = useDebounce<Token | undefined>(sellToken, 500);
  const lazyBuyToken = useDebounce<Token | undefined>(buyToken, 500);

  const [showConfirmSwap, setShowConfirmSwap] = useState(false);

  const sellTokenBalance = useTokenBalance({
    provider,
    account,
    contractAddress: lazySellToken?.contractAddress,
  });

  const buyTokenBalance = useTokenBalance({
    provider,
    account,
    contractAddress: lazyBuyToken?.contractAddress,
  });

  const handleQuoteSuccess = (data?: ZeroExQuoteResponse | null) => {
    if (data) {
      if (lazyQuoteFor === "buy") {
        setSellAmount(BigNumber.from(data.sellAmount));
      } else {
        setBuyAmount(BigNumber.from(data.buyAmount));
      }
    }
  };

  const quote = useSwapQuote({ onSuccess: handleQuoteSuccess });

  const { quoteQuery } = quote;

  const handleSwapTokens = () => {
    const sell = sellToken;
    const buy = buyToken;

    const tempSellAmount = sellAmount;
    const tempBuyAmount = buyAmount;

    setBuyToken(sell);
    setBuyAmount(tempSellAmount);

    setSellToken(buy);
    setSellAmount(tempBuyAmount);
  };

  const handleOpenSelectToken = (selectFor: SwapSide, token?: Token) => {
    setSelectSide(selectFor);
    setShowSelectToken(true);
  };

  const handleSelectToken = (token: Token) => {
    if (selectSide === "sell") {
      if (
        token.chainId === buyToken?.chainId &&
        isAddressEqual(token.contractAddress, buyToken.contractAddress)
      ) {
        handleSwapTokens();
      } else {
        setSellToken(token);
      }
      setQuoteFor("buy");
    } else {
      if (
        token.chainId === sellToken?.chainId &&
        isAddressEqual(token.contractAddress, sellToken.contractAddress)
      ) {
        handleSwapTokens();
      } else {
        setBuyToken(token);
      }
      setQuoteFor("sell");
    }

    setSelectSide(undefined);
    setShowSelectToken(false);
  };

  const handleChangeBuyAmount = useCallback(
    (value: BigNumber) => {
      if (buyToken) {
        setQuoteFor("buy");
        setBuyAmount(value);
      }
    },
    [buyToken]
  );

  const handleChangeSellAmount = useCallback(
    (value: BigNumber) => {
      if (sellToken) {
        setQuoteFor("sell");
        setSellAmount(value);
      }
    },
    [sellToken]
  );

  const setShowConnectWallet = useSetAtom(showConnectWalletAtom);

  const handleConnectWallet = () => {
    setShowConnectWallet(true);
  };

  const handleCloseSelectToken = () => {
    setShowSelectToken(false);
  };

  const handleCloseConfirmSwap = () => {
    setShowConfirmSwap(false);
    quote.setSkipValidation(true);
  };

  const handleChangeNetwork = async (chainId: ChainId) => {
    if (isActive && connector) {
      switchNetwork(connector, chainId);
    } else {
      onChangeNetwork(chainId);
    }
  };

  const chainId = useAsyncMemo<ChainId | undefined>(
    async (initial) => {
      if (provider) {
        return (await provider.getNetwork()).chainId;
      }
    },
    undefined,
    [provider]
  );

  const execType: ExecType = useAsyncMemo<ExecType>(
    async (initial) => {
      let result: ExecType = initial;

      if (lazyBuyToken && lazySellToken && quoteQuery.data) {
        if (!lazyBuyToken.isWrapped && !lazySellToken.isWrapped) {
          if (account) {
            const sufficientAllowance = await hasSufficientAllowance({
              spender: quoteQuery.data.allowanceTarget,
              tokenAddress: quoteQuery.data.sellTokenAddress,
              amount: BigNumber.from(quoteQuery.data.sellAmount),
              provider,
              account,
            });
            if (!sufficientAllowance) {
              return "approve";
            }
          }
        }
      }

      result =
        lazyBuyToken?.isWrapped &&
        isAddressEqual(
          lazySellToken?.contractAddress,
          ZEROEX_NATIVE_TOKEN_ADDRESS
        )
          ? "wrap"
          : lazySellToken?.isWrapped &&
            isAddressEqual(
              lazyBuyToken?.contractAddress,
              ZEROEX_NATIVE_TOKEN_ADDRESS
            )
          ? "unwrap"
          : "swap";

      return result;
    },
    "quote",
    [
      lazyBuyToken,
      lazySellToken,
      quoteQuery.data,
      account,
      lazySellAmount,
      provider,
    ]
  );

  const { enqueueSnackbar } = useSnackbar();

  const { formatMessage } = useIntl();

  const handleConfirmExecSwap = async () => {
    if (quoteQuery.data) {
      const onError = (err: unknown) => {
        enqueueSnackbar(
          formatMessage({
            id: "transaction.rejected",
            defaultMessage: "Transaction rejected",
          }),
          { variant: "error" }
        );
      };

      handleCloseConfirmSwap();

      await execMutation.mutateAsync(
        {
          quote: quoteQuery.data,
          provider: provider as providers.Web3Provider,
          onHash: (hash: string) => {
            console.log(hash);
          },
        },
        {
          onSuccess: (receipt: ethers.providers.TransactionReceipt) => {},
          onError,
        }
      );
    }
  };

  const handleExecSwap = useCallback(async () => {
    if (execType === "swap" && quoteQuery.data) {
      setShowConfirmSwap(true);
      quote.setSkipValidation(false);
      quote.quoteQuery.refetch();
    } else if (execType === "wrap") {
      await wrapMutation.mutateAsync(
        {
          provider: provider as providers.Web3Provider,
          amount: lazySellAmount,
          onHash: (hash: string) => {
            console.log(hash);
          },
        },
        {
          onSuccess: (receipt: ethers.providers.TransactionReceipt) => {},
        }
      );
    } else if (execType === "approve" && quoteQuery.data) {
      await approveMutation.mutateAsync(
        {
          spender: quoteQuery.data.allowanceTarget,
          provider: provider as providers.Web3Provider,
          tokenAddress: quoteQuery.data.sellTokenAddress,
          amount: ethers.constants.MaxUint256,
        },
        {
          onSuccess: () => {},
        }
      );
    } else if (execType === "unwrap") {
      await unwrapMutation.mutateAsync(
        {
          provider: provider as providers.Web3Provider,
          amount: lazySellAmount,
          onHash: (hash: string) => {
            console.log(hash);
          },
        },
        {
          onSuccess: (receipt: ethers.providers.TransactionReceipt) => {
            quoteQuery.refetch();
          },
        }
      );
    }
  }, [quoteQuery.data, execType, lazySellAmount, provider]);

  useEffect(() => {
    (async () => {
      if (
        lazySellToken &&
        lazyBuyToken &&
        lazyQuoteFor &&
        (lazySellAmount || lazyBuyAmount)
      ) {
        if (execType === "wrap" || execType === "unwrap") {
          setBuyAmount(lazySellAmount);
        } else if (provider && lazyQuoteFor) {
          if (!quote.enabled) {
            quote.setEnabled(true);
          }

          quote.setParams({
            chainId: (await provider.getNetwork()).chainId,
            sellToken: lazySellToken,
            buyToken: lazyBuyToken,
            sellTokenAmount: lazySellAmount,
            buyTokenAmount: lazyBuyAmount,
            quoteFor: lazyQuoteFor,
            account,
          });
        }
        setQuoteFor(undefined);
      }
    })();
  }, [
    lazyQuoteFor,
    lazySellAmount,
    lazyBuyAmount,
    lazySellToken,
    lazyBuyToken,
    execType,
    account,
    provider,
  ]);

  return {
    chainId,
    buyToken: lazyBuyToken,
    sellToken: lazySellToken,
    showSelect,
    selectSide,
    execType,
    sellAmount: lazySellAmount,
    buyAmount: lazyBuyAmount,
    quoteFor: lazyQuoteFor,
    insufficientBalance: lazySellAmount.gt(
      sellTokenBalance.data ?? BigNumber.from(0)
    ),
    isExecuting:
      wrapMutation.isLoading ||
      unwrapMutation.isLoading ||
      execMutation.isLoading ||
      approveMutation.isLoading,
    quote: quoteQuery.data,
    sellTokenBalance: sellTokenBalance.data,
    buyTokenBalance: buyTokenBalance.data,
    showConfirmSwap,
    setQuoteFor,
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
  };
}

export function useSwapProvider({
  provider,
  defaultChainId,
}: {
  provider?: ethers.providers.BaseProvider;
  defaultChainId: ChainId;
}) {
  if (!provider) {
    return new ethers.providers.JsonRpcProvider(
      NETWORKS[defaultChainId].providerRpcUrl
    );
  }

  return provider;
}
