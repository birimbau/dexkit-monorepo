import {
  ChainId,
  useApproveToken,
  useErc20BalanceQuery,
  useTokenAllowanceQuery,
} from "@dexkit/core";
import { UserEvents } from "@dexkit/core/constants/userEvents";
import { SUPPORTED_GASLESS_CHAIN } from "@dexkit/core/constants/zrx";
import { ZeroExGaslessQuoteResponse } from "@dexkit/core/services/zrx/types";
import { Token } from "@dexkit/core/types";
import {
  formatBigNumber,
  getChainName,
  isAddressEqual,
} from "@dexkit/core/utils";
import { parseUnits } from "@dexkit/core/utils/ethers/parseUnits";
import { isNativeInSell } from "@dexkit/core/utils/zrx";
import {
  useDexKitContext,
  useSwitchNetworkMutation,
  useWaitTransactionConfirmation,
} from "@dexkit/ui/hooks";
import { useTrackUserEventsMutation } from "@dexkit/ui/hooks/userEvents";
import { useSignTypeData } from "@dexkit/ui/hooks/web3/useSignTypeData";
import { AppNotificationType } from "@dexkit/ui/types";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import type { providers } from "ethers";
import { BigNumber, utils } from "ethers";
import { useCallback, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { EXCHANGE_NOTIFICATION_TYPES } from "../../../constants/messages";
import { useZrxQuoteQuery } from "../../../hooks/zrx";
import { useMarketTradeGaslessExec } from "../../../hooks/zrx/useMarketTradeGaslessExec";
import { useMarketTradeGaslessState } from "../../../hooks/zrx/useMarketTradeGaslessState";
import { getZrxExchangeAddress } from "../../../utils";
import LazyDecimalInput from "../LazyDecimalInput";
import ReviewMarketOrderDialog from "../ReviewMarketOrderDialog";

export interface MarketBuyFormProps {
  quoteToken: Token;
  baseToken: Token;
  quoteTokens?: Token[];
  side: "sell" | "buy";
  provider?: providers.Web3Provider;
  account?: string;
  slippage?: number;
  feeRecipient?: string;
  buyTokenPercentageFee?: number;
  affiliateAddress?: string;
  chainId?: ChainId;
  isActive?: boolean;
  useGasless?: boolean;
}

export default function MarketForm({
  chainId,
  baseToken: baseToken,
  quoteToken: defaultQuoteToken,
  account,
  side,
  provider,
  slippage,
  affiliateAddress,
  buyTokenPercentageFee,
  feeRecipient,
  quoteTokens,
  useGasless,
  isActive,
}: MarketBuyFormProps) {
  const { createNotification } = useDexKitContext();
  const [showReview, setShowReview] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [selectedQuoteToken, setSelectedQuoteToken] = useState<Token>();

  const quoteToken = useMemo(() => {
    if (selectedQuoteToken) {
      return selectedQuoteToken;
    }
    return defaultQuoteToken;
  }, [selectedQuoteToken]);

  const filteredQuoteTokens = useMemo(() => {
    if (baseToken && quoteTokens) {
      return quoteTokens.filter(
        (tk) =>
          !(
            (isAddressEqual(baseToken.address, tk.address) &&
              baseToken.chainId === tk.chainId) ||
            (isAddressEqual(quoteToken.address, tk.address) &&
              quoteToken.chainId === tk.chainId)
          )
      );
    }
  }, [quoteToken, quoteTokens, baseToken]);

  const baseTokenBalanceQuery = useErc20BalanceQuery({
    account,
    provider,
    contractAddress: baseToken?.address,
  });

  const quoteTokenBalanceQuery = useErc20BalanceQuery({
    account,
    provider,
    contractAddress: quoteToken?.address,
  });

  const quoteTokenBalance = quoteTokenBalanceQuery.data;
  const baseTokenBalance = baseTokenBalanceQuery.data;

  const handleChangeAmount = useCallback((value?: string) => {
    setAmount(value);
  }, []);

  const [amount, setAmount] = useState<string | undefined>("0.0");

  const quoteTokenBalanceFormatted = useMemo(() => {
    if (quoteTokenBalance) {
      return formatBigNumber(quoteTokenBalance, quoteToken.decimals);
    }

    return "0.0";
  }, [quoteTokenBalance, quoteToken]);

  const baseTokenBalanceFormatted = useMemo(() => {
    if (baseTokenBalance) {
      return formatBigNumber(baseTokenBalance, baseToken.decimals);
    }

    return "0.0";
  }, [quoteTokenBalance, baseToken]);

  //const [quote, setQuote] = useState<ZeroExQuoteResponse>();

  const approveMutation = useApproveToken();
  const amountToTrade =
    amount && Number(amount) > 0
      ? parseUnits(amount, baseToken.decimals).toString()
      : undefined;

  const sideToBuy: any = {};
  if (side === "buy") {
    sideToBuy.buyAmount = amountToTrade;
  } else {
    sideToBuy.sellAmount = amountToTrade;
  }

  const canGasless = useMemo(() => {
    if (
      useGasless &&
      chainId &&
      SUPPORTED_GASLESS_CHAIN.includes(chainId) &&
      !isNativeInSell({
        side,
        sellToken: {
          address: side === "buy" ? quoteToken.address : baseToken.address,
        },
        buyToken: {
          address: side === "buy" ? baseToken.address : quoteToken.address,
        },
      })
    ) {
      return true;
    }
    return false;
  }, [useGasless]);

  const quoteQuery = useZrxQuoteQuery({
    chainId,
    params: {
      ...sideToBuy,
      buyToken: side === "buy" ? baseToken.address : quoteToken.address,
      sellToken: side === "buy" ? quoteToken.address : baseToken.address,
      affiliateAddress: affiliateAddress ? affiliateAddress : "",
      skipValidation: showReview ? false : true,
      slippagePercentage: slippage,
      takerAddress: account,
      feeRecipient,
      buyTokenPercentageFee,
      acceptedTypes: "metatransaction_v2",
      feeType: "volume",
      feeSellTokenPercentage: buyTokenPercentageFee,
    },
    useGasless: canGasless,
  });

  const marketTradeGasless = useMarketTradeGaslessExec({
    onNotification: createNotification,
  });

  const quote = quoteQuery.data;

  const tokenAllowanceQuery = useTokenAllowanceQuery({
    account,
    provider,
    spender: getZrxExchangeAddress(chainId),
    tokenAddress: quote?.sellTokenAddress,
  });

  const [formattedCost, hasSufficientBalance] = useMemo(() => {
    if (side === "buy" && quote && quoteTokenBalance && quoteToken) {
      const total = formatBigNumber(
        BigNumber.from(quote.sellAmount),
        quoteToken.decimals
      );

      const hasAmount = quoteTokenBalance.gte(BigNumber.from(quote.sellAmount));

      return [total, hasAmount];
    }

    if (
      side === "sell" &&
      quote &&
      baseTokenBalance &&
      baseToken &&
      quoteToken
    ) {
      const total = formatBigNumber(
        BigNumber.from(quote.buyAmount),
        quoteToken.decimals
      );

      const hasAmount = baseTokenBalance.gte(BigNumber.from(quote.sellAmount));

      return [total, hasAmount];
    }

    return ["0.0", false];
  }, [quote, quoteTokenBalance, quoteToken, side, baseToken, baseTokenBalance]);

  const [hash, setHash] = useState<string>();
  const [tradeHash, setTradeHash] = useState<string>();
  const [approvalSignature, setApprovalSignature] = useState<string>();
  const trackUserEvent = useTrackUserEventsMutation();
  const gaslessTradeStatus = useMarketTradeGaslessState({ chainId, tradeHash });

  const waitTxResult = useWaitTransactionConfirmation({
    transactionHash: hash,
    provider,
  });

  const signTypeDataMutation = useSignTypeData();

  const sendTxMutation = useMutation(async () => {
    if (amount) {
      if (canGasless) {
        const data = quoteQuery.data as ZeroExGaslessQuoteResponse;

        if (data.trade) {
          const { eip712, type } = data.trade;
          const signature = await signTypeDataMutation.mutateAsync({
            domain: eip712.domain,
            value: eip712.message,
            primaryType: eip712.primaryType,
            types: eip712.types,
          });
          if (signature) {
            const sign = utils.splitSignature(signature);
            const trade = {
              type: type,
              eip712: eip712,
              signature: {
                v: sign.v,
                r: sign.r,
                s: sign.s,
                signatureType: 2,
              },
            };

            let approval;
            if (approvalSignature) {
              const signAppr = utils.splitSignature(approvalSignature);
              const { eip712: eip721Appr, type: ApprType } = data.approval;
              approval = {
                type: ApprType,
                eip712: eip721Appr,
                signature: {
                  v: signAppr.v,
                  r: signAppr.r,
                  s: signAppr.s,
                  signatureType: 2,
                },
              };
            }
            const trHash = await marketTradeGasless.mutateAsync({
              trade: trade,
              approval: approval,
              quote: data,
              chainId,
              sellToken: baseToken,
              buyToken: quoteToken,
            });
            if (trHash) {
              setTradeHash(trHash);
            }
          }
        }
      } else {
        let res = await provider?.getSigner().sendTransaction({
          data: quote?.data,
          to: quote?.to,
          value: BigNumber.from(quote?.value),
        });
        const subType = side == "buy" ? "marketBuy" : "marketSell";
        const messageType = EXCHANGE_NOTIFICATION_TYPES[
          subType
        ] as AppNotificationType;
        createNotification({
          type: "transaction",
          icon: messageType.icon,
          subtype: subType,
          metadata: {
            hash: res?.hash,
            chainId: chainId,
          },
          values: {
            sellAmount: amount,
            sellTokenSymbol: baseToken.symbol.toUpperCase(),
            buyAmount: formattedCost,
            buyTokenSymbol: quoteToken.symbol.toUpperCase(),
          },
        });
        trackUserEvent.mutate({
          event: side == "buy" ? UserEvents.marketBuy : UserEvents.marketSell,
          hash: res?.hash,
          chainId,
          metadata: JSON.stringify({
            quote,
          }),
        });

        setHash(res?.hash);
      }
    }
  });

  const handleCloseReview = () => {
    baseTokenBalanceQuery.refetch();
    quoteTokenBalanceQuery.refetch();
    setShowReview(false);
    setTradeHash(undefined);
    setApprovalSignature(undefined);
  };

  const handleApprove = async () => {
    if (canGasless) {
      const gaslessQuote = quoteQuery.data as ZeroExGaslessQuoteResponse;
      if (gaslessQuote?.approval && gaslessQuote?.approval.isRequired) {
        if (gaslessQuote.approval.isGasslessAvailable) {
          const { eip712 } = gaslessQuote.approval;
          const signature = await signTypeDataMutation.mutateAsync({
            domain: eip712.domain,
            value: eip712.message,
            primaryType: eip712.primaryType,
            types: eip712.types,
          });
          if (signature) {
            setApprovalSignature(signature);
          }
        } else {
          await approveMutation.mutateAsync({
            onSubmited: (hash: string) => {},
            amount: BigNumber.from(quote?.sellAmount),
            provider,
            spender: getZrxExchangeAddress(chainId),
            tokenContract: quote?.sellTokenAddress,
          });
          tokenAllowanceQuery.refetch();
        }
      }
    } else {
      await approveMutation.mutateAsync({
        onSubmited: (hash: string) => {},
        amount: BigNumber.from(quote?.sellAmount),
        provider,
        spender: getZrxExchangeAddress(chainId),
        tokenContract: quote?.sellTokenAddress,
      });
      tokenAllowanceQuery.refetch();
    }
  };

  const handleConfirm = async () => {
    await sendTxMutation.mutateAsync();
  };

  const handleExecute = () => {
    setShowReview(true);
  };

  const { chainId: providerChainId, connector } = useWeb3React();
  const switchNetworkMutation = useSwitchNetworkMutation();

  const isApproval = useMemo(() => {
    if (canGasless) {
      const gaslessQuote = quoteQuery.data as ZeroExGaslessQuoteResponse;
      if (gaslessQuote?.approval) {
        return gaslessQuote?.approval?.isRequired && !approvalSignature;
      }
    } else {
      return (
        tokenAllowanceQuery.data !== null &&
        tokenAllowanceQuery.data?.lt(BigNumber.from(quote?.sellAmount || "0"))
      );
    }
  }, [
    tokenAllowanceQuery.data,
    quote?.sellAmount,
    canGasless,
    quoteQuery.data,
  ]);

  const renderActionButton = useCallback(() => {
    if (providerChainId && chainId && providerChainId !== chainId) {
      return (
        <Button
          disabled={switchNetworkMutation.isLoading}
          size="large"
          fullWidth
          variant="contained"
          onClick={async () => {
            switchNetworkMutation.mutateAsync({ chainId });
          }}
        >
          <FormattedMessage
            id="switch.to.network"
            defaultMessage="Switch to {network}"
            values={{ network: getChainName(chainId) }}
          />
        </Button>
      );
    }

    return (
      <Button
        disabled={quoteQuery.isLoading || !hasSufficientBalance}
        size="large"
        fullWidth
        startIcon={
          quoteQuery.isLoading ? <CircularProgress size={"small"} /> : undefined
        }
        variant="contained"
        onClick={handleExecute}
      >
        {quoteQuery.isLoading ? (
          <FormattedMessage
            id="loading.quote"
            defaultMessage="Loading quote..."
          />
        ) : !amount || amount === "0.0" ? (
          <FormattedMessage id="fill.amount" defaultMessage="Fill amount" />
        ) : !hasSufficientBalance ? (
          <FormattedMessage
            id="insufficient"
            defaultMessage="Insufficient {symbol}"
            values={{
              symbol:
                side === "buy"
                  ? quoteToken.symbol.toUpperCase()
                  : baseToken.symbol.toUpperCase(),
            }}
          />
        ) : side === "buy" ? (
          <FormattedMessage
            id="buy.symbol"
            defaultMessage="Buy {symbol}"
            values={{ symbol: baseToken.symbol.toUpperCase() }}
          />
        ) : (
          <FormattedMessage
            id="sell.symbol"
            defaultMessage="Sell {symbol}"
            values={{ symbol: baseToken.symbol.toUpperCase() }}
          />
        )}
      </Button>
    );
  }, [
    chainId,
    side,
    connector,
    providerChainId,
    baseToken,
    quoteToken,
    handleExecute,
    hasSufficientBalance,
  ]);

  return (
    <>
      <ReviewMarketOrderDialog
        DialogProps={{
          open: showReview,
          maxWidth: "sm",
          fullWidth: true,
          onClose: handleCloseReview,
        }}
        isApproving={
          approveMutation.isLoading || signTypeDataMutation.isLoading
        }
        isApproval={isApproval}
        chainId={chainId}
        price={quote?.price}
        pendingHash={gaslessTradeStatus?.successTxGasless?.hash}
        hash={hash || gaslessTradeStatus?.confirmedTxGasless?.hash}
        reasonFailedGasless={gaslessTradeStatus?.reasonFailedGasless}
        quoteToken={quoteToken}
        baseToken={baseToken}
        baseAmount={
          quote?.sellAmount
            ? BigNumber.from(
                side === "buy" ? quote?.buyAmount : quote?.sellAmount
              )
            : undefined
        }
        quoteAmount={
          quote?.sellAmount
            ? BigNumber.from(
                side === "buy" ? quote?.sellAmount : quote?.buyAmount
              )
            : undefined
        }
        side={side}
        isPlacingOrder={
          sendTxMutation.isLoading ||
          waitTxResult.isFetching ||
          gaslessTradeStatus?.isLoadingStatusGasless
        }
        onConfirm={handleConfirm}
        onApprove={handleApprove}
        canGasless={canGasless}
      />
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <LazyDecimalInput onChange={handleChangeAmount} token={baseToken} />
          </Grid>
          <Grid item xs={12}>
            {side === "buy" ? (
              <Typography variant="body2">
                <FormattedMessage id="available" defaultMessage="Available" />:{" "}
                {quoteTokenBalanceQuery.isLoading ? (
                  <Skeleton sx={{ minWidth: "50px" }} />
                ) : (
                  <>
                    {quoteTokenBalanceFormatted}{" "}
                    {quoteToken.symbol.toUpperCase()}
                  </>
                )}
              </Typography>
            ) : (
              <Typography variant="body2">
                <FormattedMessage id="available" defaultMessage="Available" />:{" "}
                {baseTokenBalanceQuery.isLoading ? (
                  <Skeleton sx={{ minWidth: "50px" }} />
                ) : (
                  <>
                    {baseTokenBalanceFormatted} {baseToken.symbol.toUpperCase()}
                  </>
                )}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Box>
              <Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  spacing={2}
                  alignItems="center"
                >
                  <Typography>
                    {side === "buy" ? (
                      <FormattedMessage id="cost" defaultMessage="Cost" />
                    ) : (
                      <FormattedMessage
                        id="You will.receive"
                        defaultMessage="You will receive"
                      />
                    )}
                  </Typography>
                  {filteredQuoteTokens && filteredQuoteTokens.length > 0 ? (
                    <Box
                      display={"flex"}
                      alignContent={"center"}
                      alignItems={"center"}
                    >
                      <Typography color="text.secondary">
                        {quoteQuery.isLoading ? (
                          <Skeleton sx={{ minWidth: "50px" }} />
                        ) : (
                          <>{formattedCost}</>
                        )}
                      </Typography>

                      <Button
                        sx={{
                          color: "text.secondary",
                        }}
                        size={"large"}
                        id="basic-button"
                        aria-controls={open ? "basic-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={handleClick}
                      >
                        {open ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                        {quoteToken.symbol.toUpperCase()}
                      </Button>
                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                          "aria-labelledby": "basic-button",
                        }}
                      >
                        {filteredQuoteTokens.map((tk, key) => (
                          <MenuItem
                            onClick={() => {
                              setSelectedQuoteToken(tk);
                              handleClose();
                            }}
                            key={key}
                          >
                            {tk?.symbol.toUpperCase()}
                          </MenuItem>
                        ))}
                      </Menu>
                    </Box>
                  ) : (
                    <Typography color="text.secondary">
                      {quoteQuery.isLoading ? (
                        <Skeleton sx={{ minWidth: "50px" }} />
                      ) : (
                        <>
                          {formattedCost} {quoteToken.symbol.toUpperCase()}
                        </>
                      )}
                    </Typography>
                  )}
                </Stack>
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={12}>
            {renderActionButton()}
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
