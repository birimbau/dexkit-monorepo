import {
  ChainId,
  useApproveToken,
  useErc20BalanceQuery,
  useTokenAllowanceQuery,
} from "@dexkit/core";
import { UserEvents } from "@dexkit/core/constants/userEvents";
import { Token } from "@dexkit/core/types";
import {
  formatBigNumber,
  getChainName,
  isAddressEqual,
} from "@dexkit/core/utils";
import {
  useDexKitContext,
  useSwitchNetworkMutation,
  useWaitTransactionConfirmation,
} from "@dexkit/ui/hooks";
import { useTrackUserEventsMutation } from "@dexkit/ui/hooks/userEvents";
import { AppNotificationType } from "@dexkit/ui/types";
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
import { useWeb3React } from "@web3-react/core";
import { BigNumber, ethers, providers } from "ethers";
import { useCallback, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { EXCHANGE_NOTIFICATION_TYPES } from "../../../constants/messages";
import { useZrxQuoteQuery } from "../../../hooks/zrx";
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
      ? ethers.utils.parseUnits(amount, baseToken.decimals).toString()
      : undefined;

  const sideToBuy: any = {};
  if (side === "buy") {
    sideToBuy.buyAmount = amountToTrade;
  } else {
    sideToBuy.sellAmount = amountToTrade;
  }

  const quoteQuery = useZrxQuoteQuery({
    chainId,
    params: {
      ...sideToBuy,
      buyToken: side === "buy" ? baseToken.address : quoteToken.address,
      sellToken: side === "buy" ? quoteToken.address : baseToken.address,
      affiliateAddress: affiliateAddress ? affiliateAddress : "",
      skipValidation: showReview ? false : true,
      slippagePercentage: slippage,
      feeRecipient,
      buyTokenPercentageFee,
    },
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

      const hasAmount = quoteTokenBalance.gte(
        ethers.BigNumber.from(quote.sellAmount)
      );

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

      const hasAmount = baseTokenBalance.gte(
        ethers.BigNumber.from(quote.sellAmount)
      );

      return [total, hasAmount];
    }

    return ["0.0", false];
  }, [quote, quoteTokenBalance, quoteToken, side, baseToken, baseTokenBalance]);

  const [hash, setHash] = useState<string>();
  const trackUserEvent = useTrackUserEventsMutation();
  const waitTxResult = useWaitTransactionConfirmation({
    transactionHash: hash,
    provider,
  });

  const sendTxMutation = useMutation(async () => {
    if (amount) {
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
  });

  const handleCloseReview = () => {
    setShowReview(false);
  };

  const handleApprove = async () => {
    await approveMutation.mutateAsync({
      onSubmited: (hash: string) => {},
      amount: BigNumber.from(quote?.sellAmount),
      provider,
      spender: getZrxExchangeAddress(chainId),
      tokenContract: quote?.sellTokenAddress,
    });
    tokenAllowanceQuery.refetch();
  };

  const handleConfirm = async () => {
    await sendTxMutation.mutateAsync();
  };

  const handleExecute = () => {
    setShowReview(true);
  };

  const { chainId: providerChainId, connector } = useWeb3React();
  const switchNetworkMutation = useSwitchNetworkMutation();

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
        isApproving={approveMutation.isLoading}
        isApproval={
          tokenAllowanceQuery.data !== null &&
          tokenAllowanceQuery.data?.lt(BigNumber.from(quote?.sellAmount || "0"))
        }
        chainId={chainId}
        price={quote?.price}
        hash={hash}
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
        isPlacingOrder={sendTxMutation.isLoading || waitTxResult.isFetching}
        onConfirm={handleConfirm}
        onApprove={handleApprove}
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
