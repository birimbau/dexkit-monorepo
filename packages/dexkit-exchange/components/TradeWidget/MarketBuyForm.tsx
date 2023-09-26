import { Token } from "@dexkit/core/types";
import {
  Box,
  Button,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { BigNumber, ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";

import { ChainId, useApproveToken, useTokenAllowanceQuery } from "@dexkit/core";
import { ZeroExQuoteResponse } from "@dexkit/core/services/zrx/types";
import { formatBigNumber } from "@dexkit/core/utils";
import {
  useExecuteTransactionsDialog,
  useWaitTransactionConfirmation,
} from "@dexkit/ui/hooks";
import { useMutation } from "@tanstack/react-query";
import { useZrxQuoteMutation } from "../../hooks/zrx";
import { BigNumberUtils, getZrxExchangeAddress } from "../../utils";
import LazyDecimalInput from "./LazyDecimalInput";
import ReviewMarketOrderDialog from "./ReviewMarketOrderDialog";

export interface MarketBuyFormProps {
  quoteToken: Token;
  baseToken: Token;
  provider?: ethers.providers.Web3Provider;
  account?: string;
  baseTokenBalance?: ethers.BigNumber;
  quoteTokenBalance?: ethers.BigNumber;
  feeRecipient?: string;
  buyTokenPercentageFee?: number;
  affiliateAddress?: string;
  chainId?: ChainId;
  isActive?: boolean;
}

export default function MarketBuyForm({
  chainId,
  baseToken: baseToken,
  quoteToken: quoteToken,
  account,
  provider,
  baseTokenBalance,
  affiliateAddress,
  quoteTokenBalance,
  buyTokenPercentageFee,
  feeRecipient,
  isActive,
}: MarketBuyFormProps) {
  const [showReview, setShowReview] = useState(false);

  const handleChangeAmount = (value: string) => {
    setAmount(value);
  };

  const [amount, setAmount] = useState("0.0");

  const quoteTokenBalanceFormatted = useMemo(() => {
    if (quoteTokenBalance) {
      return formatBigNumber(quoteTokenBalance, quoteToken.decimals);
    }

    return "0.0";
  }, [quoteTokenBalance, quoteToken]);

  const quoteMutation = useZrxQuoteMutation({ chainId });

  const [quote, setQuote] = useState<ZeroExQuoteResponse>();

  const [formattedCost, hasSufficientBalance] = useMemo(() => {
    if (quote && quoteTokenBalance) {
      const total = formatBigNumber(
        BigNumber.from(quote.sellAmount),
        quoteToken.decimals
      );

      const hasAmount = quoteTokenBalance.gte(
        ethers.BigNumber.from(quote.sellAmount)
      );

      return [total, hasAmount];
    }

    return ["0.0", false];
  }, [quote, baseTokenBalance, quoteToken]);

  const txDialog = useExecuteTransactionsDialog();

  const approveMutation = useApproveToken();

  const tokenAllowanceQuery = useTokenAllowanceQuery({
    account,
    provider,
    spender: getZrxExchangeAddress(chainId),
    tokenAddress: quote?.sellTokenAddress,
  });

  useEffect(() => {
    (async () => {
      let newQuote = await quoteMutation.mutateAsync({
        buyToken: baseToken.contractAddress,
        sellToken: quoteToken.contractAddress,
        affiliateAddress: affiliateAddress ? affiliateAddress : "",
        buyAmount: ethers.utils
          .parseUnits(amount, baseToken.decimals)
          .toString(),
        skipValidation: true,
        slippagePercentage: 0.01,
        feeRecipient,
        buyTokenPercentageFee,
      });

      if (newQuote) {
        setQuote(newQuote);
      }
    })();
  }, [amount, isActive]);

  const [hash, setHash] = useState<string>();

  const waitTxResult = useWaitTransactionConfirmation({
    transactionHash: hash,
    provider,
  });

  const sendTxMutation = useMutation(async () => {
    let res = await provider?.getSigner().sendTransaction({
      data: quote?.data,
      to: quote?.to,
      gasPrice: ethers.BigNumber.from(quote?.gasPrice),
      value: ethers.BigNumber.from(quote?.value),
    });

    setHash(res?.hash);
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
  };

  const [amountPerToken, setAmountPerToken] = useState("0.0");

  const handleQuotePrice = async () => {
    const quote = await quoteMutation.mutateAsync({
      buyToken: baseToken.contractAddress,
      sellToken: quoteToken.contractAddress,
      affiliateAddress: affiliateAddress || "",
      buyAmount: ethers.utils.parseUnits("1.0", baseToken.decimals).toString(),
      skipValidation: true,
      slippagePercentage: 0.01,
      feeRecipient,
      buyTokenPercentageFee: buyTokenPercentageFee
        ? buyTokenPercentageFee / 100
        : undefined,
    });

    const sellAmount = BigNumber.from(quote?.sellAmount || "0");

    setAmountPerToken(
      ethers.utils.formatUnits(sellAmount, quoteToken.decimals)
    );
  };

  const parsedAmount = useMemo(() => {
    return parseFloat(amount !== "" ? amount : "0.0");
  }, [amount]);

  const parsedAmountPerToken = useMemo(() => {
    return ethers.utils.parseUnits(
      amountPerToken || "0.0",
      quoteToken.decimals
    );
  }, [amountPerToken, quoteToken]);

  const total = useMemo(() => {
    return new BigNumberUtils().multiply(parsedAmountPerToken, parsedAmount);
  }, [parsedAmountPerToken, parsedAmount]);

  const handleConfirm = async () => {
    await sendTxMutation.mutateAsync();
  };

  const handleExecute = () => {
    setShowReview(true);
    handleQuotePrice();
  };

  return (
    <>
      <ReviewMarketOrderDialog
        DialogProps={{
          open: showReview,
          maxWidth: "sm",
          fullWidth: true,
          onClose: handleCloseReview,
        }}
        total={total}
        isApproving={approveMutation.isLoading}
        isApproval={
          tokenAllowanceQuery.data !== null &&
          tokenAllowanceQuery.data?.lt(BigNumber.from(quote?.sellAmount || "0"))
        }
        chainId={chainId}
        hash={hash}
        amountPerToken={parsedAmountPerToken}
        quoteToken={quoteToken}
        baseToken={baseToken}
        baseAmount={
          quote?.sellAmount
            ? BigNumber.from(quote?.buyAmount)
            : BigNumber.from("0")
        }
        side="buy"
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
            <Typography variant="body2">
              <FormattedMessage id="available" defaultMessage="Available" />:{" "}
              {quoteTokenBalanceFormatted} {quoteToken.symbol.toUpperCase()}
            </Typography>
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
                    <FormattedMessage id="cost" defaultMessage="Cost" />
                  </Typography>
                  <Typography color="text.secondary">
                    {quoteMutation.isLoading ? (
                      <Skeleton />
                    ) : (
                      <>
                        {formattedCost} {quoteToken.symbol.toUpperCase()}
                      </>
                    )}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Button
              disabled={quoteMutation.isLoading || !hasSufficientBalance}
              size="large"
              fullWidth
              variant="contained"
              onClick={handleExecute}
            >
              {!hasSufficientBalance ? (
                <FormattedMessage
                  id="insufficient"
                  defaultMessage="Insufficient {symbol}"
                  values={{ symbol: quoteToken.symbol.toUpperCase() }}
                />
              ) : (
                <FormattedMessage
                  id="buy.symbol"
                  defaultMessage="Buy {symbol}"
                  values={{ symbol: baseToken.symbol.toUpperCase() }}
                />
              )}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
