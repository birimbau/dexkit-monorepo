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
import { useExecuteTransactionsDialog } from "@dexkit/ui/hooks";
import { useZrxQuoteMutation } from "../../hooks/zrx";
import { getZrxExchangeAddress } from "../../utils";
import LazyDecimalInput from "./LazyDecimalInput";

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

  const quoteTokenBalanceFormatted = useMemo(() => {
    if (quoteTokenBalance) {
      return ethers.utils.formatUnits(quoteTokenBalance, quoteToken.decimals);
    }

    return "0.0";
  }, [quoteTokenBalance, quoteToken]);

  const quoteMutation = useZrxQuoteMutation({ chainId });

  const [quote, setQuote] = useState<ZeroExQuoteResponse>();

  const [receiveAmountFormatted, hasSufficientBalance] = useMemo(() => {
    if (quote && quoteTokenBalance) {
      const total = ethers.utils.formatUnits(
        quote.buyAmount,
        baseToken.decimals
      );

      const hasAmount = quoteTokenBalance.gte(
        ethers.BigNumber.from(quote.sellAmount)
      );

      return [total, hasAmount, baseToken];
    }

    return ["0.0", false];
  }, [quote, quoteTokenBalance]);

  const txDialog = useExecuteTransactionsDialog();

  const approveMutation = useApproveToken();

  const tokenAllowanceQuery = useTokenAllowanceQuery({
    account,
    provider,
    spender: getZrxExchangeAddress(chainId),
    tokenAddress: quote?.sellTokenAddress,
  });

  const handleExecute = () => {
    txDialog.execute([
      {
        check: () => {
          if (
            tokenAllowanceQuery.data?.gte(BigNumber.from(quote?.sellAmount))
          ) {
            return { hidden: true, conditions: ["approve"] };
          }

          return { hidden: false, conditions: [] };
        },
        action: async () => {
          const res = new Promise<string>((resolve, reject) => {
            approveMutation.mutateAsync({
              onSubmited: (hash: string) => {
                resolve(hash);
              },
              amount: BigNumber.from(quote?.sellAmount),
              provider,
              spender: getZrxExchangeAddress(chainId),
              tokenContract: quote?.sellTokenAddress,
            });
          });

          return { hash: await res, conditions: ["approve"] };
        },
        title: { id: "approve", defaultMessage: "Approve" },
      },
      {
        action: async () => {
          let res = provider?.getSigner().sendTransaction({
            data: quote?.data,
            to: quote?.to,
            gasPrice: ethers.BigNumber.from(quote?.gasPrice),
            value: ethers.BigNumber.from(quote?.value),
          });

          return { hash: (await res)?.hash };
        },
        title: {
          id: "sell.symbol.token",
          defaultMessage: "Sell {amount} {symbol}",
          values: {
            symbol: quoteToken.symbol.toUpperCase(),
            amount: quote
              ? ethers.utils.formatUnits(quote?.sellAmount, quoteToken.decimals)
              : "0.0",
          },
        },
        conditions: [
          {
            id: "approve",
            messageId: "needs.token.approval",
            defaultMessage: "Needs token approval",
          },
        ],
      },
    ]);
  };

  useEffect(() => {
    (async () => {
      if (isActive) {
        let newQuote = await quoteMutation.mutateAsync({
          buyToken: baseToken.contractAddress,
          sellToken: quoteToken.contractAddress,
          affiliateAddress: affiliateAddress ? affiliateAddress : "",
          sellAmount: ethers.utils
            .parseUnits(amount, quoteToken.decimals)
            .toString(),
          skipValidation: true,
          slippagePercentage: 0.01,
          feeRecipient,
          buyTokenPercentageFee: buyTokenPercentageFee
            ? buyTokenPercentageFee / 100
            : undefined,
        });

        if (newQuote) {
          setQuote(newQuote);
        }
      }
    })();
  }, [amount, isActive, baseToken, quoteToken]);

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <LazyDecimalInput onChange={handleChangeAmount} token={quoteToken} />
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
                      {receiveAmountFormatted} {baseToken.symbol.toUpperCase()}
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
                id="sell.symbol"
                defaultMessage="Sell {symbol}"
                values={{ symbol: quoteToken.symbol.toUpperCase() }}
              />
            )}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
