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
}: MarketBuyFormProps) {
  const handleChangeAmount = (value: string) => {
    setAmount(value);
  };

  const [amount, setAmount] = useState("0.0");

  const baseTokenBalanceFormatted = useMemo(() => {
    if (baseTokenBalance) {
      return ethers.utils.formatUnits(baseTokenBalance, baseToken.decimals);
    }

    return "0.0";
  }, [baseTokenBalance, baseToken]);

  const quoteMutation = useZrxQuoteMutation({ chainId });

  const [quote, setQuote] = useState<ZeroExQuoteResponse>();

  const [formattedCost, hasSufficientBalance] = useMemo(() => {
    if (quote && baseTokenBalance) {
      const total = ethers.utils.formatUnits(
        quote.sellAmount,
        baseToken.decimals
      );

      const hasAmount = baseTokenBalance.gte(
        ethers.BigNumber.from(quote.sellAmount)
      );

      return [total, hasAmount];
    }

    return ["0.0", false];
  }, [quote, baseTokenBalance]);

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

          return { hash: await res, conditions: [] };
        },
        title: { id: "pre-test", defaultMessage: "Pre test" },
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
          id: "buy.symbol.token",
          defaultMessage: "Buy {amount} {symbol}",
          values: {
            symbol: quoteToken.symbol.toUpperCase(),
            amount: quote
              ? ethers.utils.formatUnits(quote?.buyAmount, quoteToken.decimals)
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
          buyToken: quoteToken.contractAddress,
          sellToken: baseToken.contractAddress,
          affiliateAddress: affiliateAddress ? affiliateAddress : "",
          buyAmount: ethers.utils
            .parseUnits(amount, quoteToken.decimals)
            .toString(),
          skipValidation: true,
          slippagePercentage: 0.01,
          feeRecipient,
          buyTokenPercentageFee,
        });

        if (newQuote) {
          setQuote(newQuote);
        }
      }
    })();
  }, [amount, isActive]);

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <LazyDecimalInput onChange={handleChangeAmount} token={quoteToken} />
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
                  <FormattedMessage id="cost" defaultMessage="Cost" />
                </Typography>
                <Typography color="text.secondary">
                  {quoteMutation.isLoading ? (
                    <Skeleton />
                  ) : (
                    <>
                      {formattedCost} {baseToken.symbol.toUpperCase()}
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
                values={{ symbol: baseToken.symbol.toUpperCase() }}
              />
            ) : (
              <FormattedMessage
                id="buy.symbol"
                defaultMessage="Buy {symbol}"
                values={{ symbol: quoteToken.symbol.toUpperCase() }}
              />
            )}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
