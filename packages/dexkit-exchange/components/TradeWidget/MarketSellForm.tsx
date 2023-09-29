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
import { useCallback, useEffect, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";

import { ChainId, useApproveToken, useTokenAllowanceQuery } from "@dexkit/core";
import { ZeroExQuoteResponse } from "@dexkit/core/services/zrx/types";
import { formatBigNumber, getChainName } from "@dexkit/core/utils";
import {
  useSwitchNetworkMutation,
  useWaitTransactionConfirmation,
} from "@dexkit/ui/hooks";
import { useMutation } from "@tanstack/react-query";
import { useWeb3React } from "@web3-react/core";
import { useZrxQuoteMutation } from "../../hooks/zrx";
import { BigNumberUtils, getZrxExchangeAddress } from "../../utils";
import LazyDecimalInput from "./LazyDecimalInput";
import ReviewMarketOrderDialog from "./ReviewMarketOrderDialog";

export interface MarketSellFormProps {
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

export default function MarketSellForm({
  chainId,
  quoteToken,
  baseToken,
  account,
  provider,
  baseTokenBalance,
  affiliateAddress,
  quoteTokenBalance,
  buyTokenPercentageFee,
  feeRecipient,
  isActive,
}: MarketSellFormProps) {
  const handleChangeAmount = (value: string) => {
    setAmount(value);
  };

  const [amount, setAmount] = useState("0.0");

  const baseTokenBalanceFormatted = useMemo(() => {
    if (baseTokenBalance) {
      return formatBigNumber(baseTokenBalance, baseToken.decimals);
    }

    return "0.0";
  }, [baseTokenBalance, baseToken]);

  const quoteMutation = useZrxQuoteMutation({ chainId });

  const [quote, setQuote] = useState<ZeroExQuoteResponse>();

  const [receiveAmountFormatted, hasSufficientBalance] = useMemo(() => {
    if (quote && baseTokenBalance) {
      const total = formatBigNumber(
        BigNumber.from(quote.buyAmount),
        quoteToken.decimals
      );

      const hasAmount = baseTokenBalance?.gte(
        ethers.BigNumber.from(quote.sellAmount)
      );

      return [total, hasAmount, quoteToken];
    }

    return ["0.0", false];
  }, [quote, quoteTokenBalance, quoteToken]);

  const approveMutation = useApproveToken();

  const tokenAllowanceQuery = useTokenAllowanceQuery({
    account,
    provider,
    spender: getZrxExchangeAddress(chainId),
    tokenAddress: quote?.sellTokenAddress,
  });

  useEffect(() => {
    (async () => {
      if (Number(amount) > 0) {
        let theNewQuote = await quoteMutation.mutateAsync({
          sellToken: baseToken.contractAddress,
          buyToken: quoteToken.contractAddress,
          affiliateAddress: affiliateAddress ? affiliateAddress : "",
          sellAmount: ethers.utils
            .parseUnits(amount, baseToken.decimals)
            .toString(),
          skipValidation: true,
          slippagePercentage: 0.01,
          feeRecipient,
          buyTokenPercentageFee: buyTokenPercentageFee
            ? buyTokenPercentageFee / 100
            : undefined,
        });

        if (theNewQuote) {
          setQuote(theNewQuote);
        }
      }
    })();
  }, [amount, quoteToken, baseToken, affiliateAddress, feeRecipient]);

  const [showReview, setShowReview] = useState(false);

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

  const [amountPerToken, setAmountPerToken] = useState<string>();

  const handleQuotePrice = async () => {
    const quote = await quoteMutation.mutateAsync({
      sellToken: baseToken.contractAddress,
      buyToken: quoteToken.contractAddress,
      affiliateAddress: affiliateAddress || "",
      sellAmount: ethers.utils.parseUnits("1.0", baseToken.decimals).toString(),
      skipValidation: true,
      slippagePercentage: 0.01,
      feeRecipient,
      buyTokenPercentageFee: buyTokenPercentageFee
        ? buyTokenPercentageFee / 100
        : undefined,
    });

    const buyAmount = BigNumber.from(quote?.buyAmount || "0");

    setAmountPerToken(ethers.utils.formatUnits(buyAmount, quoteToken.decimals));
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

  const handleApprove = async () => {
    await approveMutation.mutateAsync({
      onSubmited: (hash: string) => {},
      amount: BigNumber.from(quote?.sellAmount),
      provider,
      spender: getZrxExchangeAddress(chainId),
      tokenContract: quote?.sellTokenAddress,
    });
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
    connector,
    providerChainId,
    hasSufficientBalance,
    baseToken,
    handleExecute,
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
            ? BigNumber.from(quote?.sellAmount)
            : BigNumber.from("0")
        }
        side="sell"
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
              {baseTokenBalanceFormatted} {baseToken.symbol.toUpperCase()}
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
                    <FormattedMessage
                      id="You will.receive"
                      defaultMessage="You will receive"
                    />
                  </Typography>
                  <Typography color="text.secondary">
                    {quoteMutation.isLoading ? (
                      <Skeleton />
                    ) : (
                      <>
                        {receiveAmountFormatted}{" "}
                        {quoteToken.symbol.toUpperCase()}
                      </>
                    )}
                  </Typography>
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
