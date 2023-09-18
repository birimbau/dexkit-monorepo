import { useApproveToken, useTokenAllowanceQuery } from "@dexkit/core";
import { Token } from "@dexkit/core/types";
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
import { useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { ORDER_LIMIT_DURATIONS } from "../../constants";
import { useSendLimitOrderMutation } from "../../hooks";
import { useZrxQuoteMutation } from "../../hooks/zrx";
import { BigNumberUtils, getZrxExchangeAddress } from "../../utils";
import DecimalInput from "./DecimalInput";
import DurationSelect from "./DurationSelect";
import ReviewOrderDialog from "./ReviewOrderDialog";

export interface SellFormProps {
  makerToken: Token;
  takerToken: Token;
  takerTokenBalance?: BigNumber;
  provider?: ethers.providers.Web3Provider;
  maker?: string;
}

export default function SellForm({
  makerToken,
  takerToken,
  takerTokenBalance,
  provider,
  maker,
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
    return ethers.utils.parseUnits(
      parsedAmount.toString(),
      takerToken.decimals
    );
  }, [parsedAmount, takerToken]);

  const parsedAmountPerToken = useMemo(() => {
    return ethers.utils.parseUnits(
      amountPerToken || "0.0",
      makerToken.decimals
    );
  }, [amountPerToken, makerToken]);

  const total = useMemo(() => {
    return new BigNumberUtils().multiply(parsedAmountPerToken, parsedAmount);
  }, [parsedAmountPerToken, parsedAmount]);

  const hasSufficientBalance = useMemo(() => {
    return takerTokenBalance?.gte(total) && !total.isZero();
  }, [total, takerTokenBalance]);

  const formattedTotal = useMemo(() => {
    return ethers.utils.formatUnits(total, makerToken.decimals);
  }, [makerToken, total]);

  const buttonMessage = useMemo(() => {
    if (!hasSufficientBalance) {
      return (
        <FormattedMessage
          id="insufficient.symbol"
          defaultMessage="insufficient {symbol}"
          values={{ symbol: makerToken.symbol }}
        />
      );
    }

    return (
      <FormattedMessage
        id="sell.symbol"
        defaultMessage="sell {symbol}"
        values={{ symbol: takerToken.symbol }}
      />
    );
  }, [hasSufficientBalance, takerToken, makerToken, total]);

  const { chainId } = useWeb3React();
  const quoteMutation = useZrxQuoteMutation({ chainId });

  const handleQuotePrice = async () => {
    const quote = await quoteMutation.mutateAsync({
      buyToken: takerToken.contractAddress,
      sellToken: makerToken.contractAddress,
      affiliateAddress: "0x5bD68B4d6f90Bcc9F3a9456791c0Db5A43df676d",
      buyAmount: ethers.utils.parseUnits("1.0", takerToken.decimals).toString(),
      skipValidation: true,
      slippagePercentage: 0.01,
      feeRecipient: "0x5bd68b4d6f90bcc9f3a9456791c0db5a43df676d",
      buyTokenPercentageFee: 0.001,
    });

    const sellAmount = BigNumber.from(quote?.sellAmount || "0");

    setAmountPerToken(
      ethers.utils.formatUnits(sellAmount, makerToken.decimals)
    );
  };

  const sendLimitOrderMutation = useSendLimitOrderMutation();

  const handleBuy = () => {
    setShowReview(true);
  };

  const handleChangeSliderAmount = (
    event: Event,
    value: number | number[],
    activeThumb: number
  ) => {
    const amount = takerTokenBalance?.div(100).mul(value as number);

    setAmount(
      ethers.utils.formatUnits(amount || BigNumber.from(0), takerToken.decimals)
    );

    setAmountPercentage(value as number);
  };

  const { formatMessage } = useIntl();

  const { enqueueSnackbar } = useSnackbar();

  const handleCloseReview = () => {
    setShowReview(false);
  };

  const takerAmount = useMemo(() => {
    return ethers.utils.parseUnits(
      parsedAmount.toString(),
      takerToken.decimals
    );
  }, [parsedAmount, takerToken]);

  const { account } = useWeb3React();

  const tokenAllowanceQuery = useTokenAllowanceQuery({
    account,
    provider,
    spender: getZrxExchangeAddress(chainId),
    tokenAddress: takerToken?.contractAddress,
  });

  const approveTokenMutation = useApproveToken();

  const handleApprove = async () => {
    await approveTokenMutation.mutateAsync({
      onSubmited: (hash: string) => {},
      spender: getZrxExchangeAddress(chainId),
      provider,
      tokenContract: takerToken?.contractAddress,
      amount: parsedAmountBN,
    });

    await tokenAllowanceQuery.refetch();
  };

  const handleConfirmSell = async () => {
    if (!chainId || !maker || !makerToken || !provider) {
      return;
    }

    try {
      await sendLimitOrderMutation.mutateAsync({
        chainId: chainId as number,
        expirationTime: duration,
        maker,
        makerAmount: parsedAmountBN.toString(),
        makerToken: takerToken.contractAddress,
        provider,
        takerAmount: total.toString(),
        takerToken: makerToken.contractAddress,
      });
      enqueueSnackbar(
        formatMessage({ id: "order.created", defaultMessage: "Order created" }),
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
        quoteToken={makerToken}
        baseToken={takerToken}
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
              id="available.balance"
              defaultMessage="Available: {amount} {symbol}"
              values={{
                amount: takerTokenBalance
                  ? ethers.utils.formatUnits(
                      takerTokenBalance,
                      takerToken.decimals
                    )
                  : "0.0",
                symbol: takerToken.symbol.toUpperCase(),
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
                  {takerToken.symbol.toUpperCase()}
                </InputAdornment>
              ),
            },
          }}
          decimals={takerToken.decimals}
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
                  {makerToken.symbol.toUpperCase()}
                </InputAdornment>
              ),
            },
          }}
          decimals={makerToken.decimals}
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
          <Typography variant="body1">{formattedTotal}</Typography>
        </Stack>
        <Button
          disabled={!hasSufficientBalance}
          onClick={handleBuy}
          fullWidth
          variant="contained"
          size="large"
        >
          {buttonMessage}
        </Button>
      </Stack>
    </>
  );
}
