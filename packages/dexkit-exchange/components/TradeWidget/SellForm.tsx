import { ChainId, useApproveToken, useTokenAllowanceQuery } from "@dexkit/core";
import { Token } from "@dexkit/core/types";
import { formatBigNumber, getChainName } from "@dexkit/core/utils";
import { useSwitchNetworkMutation } from "@dexkit/ui/hooks";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { BigNumber, ethers } from "ethers";
import { useSnackbar } from "notistack";
import { useCallback, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { ORDER_LIMIT_DURATIONS } from "../../constants";
import { useSendLimitOrderMutation } from "../../hooks";
import { useZrxQuoteMutation } from "../../hooks/zrx";
import { BigNumberUtils, getZrxExchangeAddress } from "../../utils";
import DecimalInput from "./DecimalInput";
import DurationSelect from "./DurationSelect";
import ReviewOrderDialog from "./ReviewOrderDialog";

export interface SellFormProps {
  baseToken: Token;
  quoteToken: Token;
  slippage?: number;
  baseTokenBalance?: BigNumber;
  provider?: ethers.providers.Web3Provider;
  maker?: string;
  buyTokenPercentageFee?: number;
  feeRecipient?: string;
  affiliateAddress?: string;
  chainId?: ChainId;
}

export default function SellForm({
  chainId,
  baseToken,
  quoteToken,
  baseTokenBalance,
  provider,
  maker,
  slippage,
  buyTokenPercentageFee,
  feeRecipient,
  affiliateAddress,
}: SellFormProps) {
  const [amountPercentage, setAmountPercentage] = useState(0);
  const [amount, setAmount] = useState("0.0");
  const [amountPerToken, setAmountPerToken] = useState("0.0");
  const [duration, setDuration] = useState(ORDER_LIMIT_DURATIONS[0].value);

  const [showReview, setShowReview] = useState(false);

  const handleChangeAmount = (value: string) => {
    setAmount(value);
  };

  const handleChangeAmountPerToken = (value: string) => {
    setAmountPerToken(value);
  };

  const handleChangeDuration = (value: number) => setDuration(value);

  const parsedAmount = useMemo(() => {
    return parseFloat(amount !== "" ? amount : "0.0");
  }, [amount]);

  const parsedAmountBN = useMemo(() => {
    return ethers.utils.parseUnits(parsedAmount.toString(), baseToken.decimals);
  }, [parsedAmount, baseToken]);

  const parsedAmountPerToken = useMemo(() => {
    return ethers.utils.parseUnits(
      amountPerToken || "0.0",
      quoteToken.decimals
    );
  }, [amountPerToken, quoteToken]);

  const total = useMemo(() => {
    return new BigNumberUtils().multiply(parsedAmountPerToken, parsedAmount);
  }, [parsedAmountPerToken, parsedAmount]);

  const hasSufficientBalance = useMemo(() => {
    return baseTokenBalance?.gte(total) && !total.isZero();
  }, [total, baseTokenBalance]);

  const formattedTotal = useMemo(() => {
    return formatBigNumber(total, quoteToken.decimals);
  }, [quoteToken, total]);

  const buttonMessage = useMemo(() => {
    if (!hasSufficientBalance) {
      return (
        <FormattedMessage
          id="insufficient.symbol"
          defaultMessage="insufficient {symbol}"
          values={{ symbol: quoteToken.symbol }}
        />
      );
    }

    return (
      <FormattedMessage
        id="sell.symbol"
        defaultMessage="sell {symbol}"
        values={{ symbol: baseToken.symbol }}
      />
    );
  }, [hasSufficientBalance, baseToken, quoteToken, total]);

  const quoteMutation = useZrxQuoteMutation({ chainId });

  const handleQuotePrice = async () => {
    const quote = await quoteMutation.mutateAsync({
      buyToken: baseToken.address,
      sellToken: quoteToken.address,
      affiliateAddress: affiliateAddress || "",
      buyAmount: ethers.utils.parseUnits("1.0", baseToken.decimals).toString(),
      skipValidation: true,
      slippagePercentage: slippage ? slippage / 100 : 0.01,
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
  /* useEffect(() => {
    handleQuotePrice();
  }, []);*/

  const sendLimitOrderMutation = useSendLimitOrderMutation();

  const handleBuy = () => {
    setShowReview(true);
  };

  const handleChangeSliderAmount = (
    event: Event,
    value: number | number[],
    activeThumb: number
  ) => {
    const amount = baseTokenBalance?.div(100).mul(value as number);

    setAmount(
      ethers.utils.formatUnits(amount || BigNumber.from(0), baseToken.decimals)
    );

    setAmountPercentage(value as number);
  };

  const { formatMessage } = useIntl();

  const { enqueueSnackbar } = useSnackbar();

  const handleCloseReview = () => {
    setShowReview(false);
  };

  const takerAmount = useMemo(() => {
    return ethers.utils.parseUnits(parsedAmount.toString(), baseToken.decimals);
  }, [parsedAmount, baseToken]);

  const { account } = useWeb3React();

  const tokenAllowanceQuery = useTokenAllowanceQuery({
    account,
    provider,
    spender: getZrxExchangeAddress(chainId),
    tokenAddress: baseToken?.address,
  });

  const approveTokenMutation = useApproveToken();

  const handleApprove = async () => {
    await approveTokenMutation.mutateAsync({
      onSubmited: (hash: string) => {},
      spender: getZrxExchangeAddress(chainId),
      provider,
      tokenContract: baseToken?.address,
      amount: parsedAmountBN,
    });

    await tokenAllowanceQuery.refetch();
  };

  const handleConfirmSell = async () => {
    if (!chainId || !maker || !quoteToken || !provider) {
      return;
    }

    try {
      await sendLimitOrderMutation.mutateAsync({
        chainId: chainId as number,
        expirationTime: duration,
        maker,
        makerAmount: parsedAmountBN.toString(),
        makerToken: baseToken.address,
        provider,
        takerAmount: total.toString(),
        takerToken: quoteToken.address,
      });
      enqueueSnackbar(
        formatMessage({
          id: "order.created.message",
          defaultMessage: "Order created",
        }),
        { variant: "success" }
      );
      setShowReview(false);
    } catch (err) {
      enqueueSnackbar(
        formatMessage({
          id: "order.failed",
          defaultMessage: "Order failed",
        }),
        { variant: "error" }
      );
    }
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
        disabled={!hasSufficientBalance}
        onClick={handleBuy}
        fullWidth
        variant="contained"
        size="large"
      >
        {buttonMessage}
      </Button>
    );
  }, [
    chainId,
    buttonMessage,
    connector,
    providerChainId,
    baseToken,
    quoteToken,
    handleBuy,
    hasSufficientBalance,
  ]);

  return (
    <>
      <ReviewOrderDialog
        DialogProps={{
          open: showReview,
          maxWidth: "sm",
          fullWidth: true,
          onClose: handleCloseReview,
        }}
        total={total}
        isApproving={approveTokenMutation.isLoading}
        isApproval={
          tokenAllowanceQuery.data !== null &&
          tokenAllowanceQuery.data?.lt(parsedAmountBN)
        }
        expiresIn={duration}
        amountPerToken={parsedAmountPerToken}
        quoteToken={quoteToken}
        baseToken={baseToken}
        baseAmount={takerAmount}
        side="sell"
        isPlacingOrder={sendLimitOrderMutation.isLoading}
        onConfirm={handleConfirmSell}
        onApprove={handleApprove}
      />
      <Stack spacing={2}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="body1">
            <FormattedMessage
              id="available.balance.amount.symbol"
              defaultMessage="Available balance: {amount} {symbol}"
              values={{
                amount: baseTokenBalance
                  ? formatBigNumber(baseTokenBalance, baseToken.decimals)
                  : "0.0",
                symbol: baseToken.symbol.toUpperCase(),
              }}
            />
          </Typography>
          <IconButton onClick={handleQuotePrice} size="small">
            <RefreshIcon />
          </IconButton>
        </Stack>
        <DecimalInput
          TextFieldProps={{
            label: <FormattedMessage id="amount" defaultMessage="Amount" />,
            InputProps: {
              endAdornment: (
                <InputAdornment position="end">
                  {baseToken.symbol.toUpperCase()}
                </InputAdornment>
              ),
            },
          }}
          decimals={baseToken.decimals}
          value={amount}
          onChange={handleChangeAmount}
        />
        <Box sx={{ px: 1 }}>
          <Slider
            size="small"
            value={amountPercentage}
            defaultValue={0}
            aria-label="Small"
            valueLabelDisplay="auto"
            onChange={handleChangeSliderAmount}
          />
        </Box>
        <DecimalInput
          TextFieldProps={{
            label: (
              <FormattedMessage
                id="amount.per.token"
                defaultMessage="Amount per token"
              />
            ),
            InputProps: {
              endAdornment: (
                <InputAdornment position="end">
                  {quoteToken.symbol.toUpperCase()}
                </InputAdornment>
              ),
            },
          }}
          decimals={quoteToken.decimals}
          value={amountPerToken}
          onChange={handleChangeAmountPerToken}
        />
        <DurationSelect
          SelectProps={{
            label: (
              <FormattedMessage id="expires.in" defaultMessage="Expires in" />
            ),
          }}
          value={duration}
          onChange={handleChangeDuration}
        />
        <Divider />

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="body1">
            <FormattedMessage id="total" defaultMessage="Total" />
          </Typography>
          <Typography variant="body1">
            {formattedTotal} {quoteToken.symbol.toUpperCase()}
          </Typography>
        </Stack>
        {renderActionButton()}
      </Stack>
    </>
  );
}
