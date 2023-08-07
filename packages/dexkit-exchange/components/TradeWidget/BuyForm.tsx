import {
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import DecimalInput from "./DecimalInput";

import { useSnackbar } from "notistack";

import { Token } from "@dexkit/core/types";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useWeb3React } from "@web3-react/core";
import { BigNumber, ethers } from "ethers";
import { ORDER_LIMIT_DURATIONS } from "../../constants";
import { useSendLimitOrderMutation } from "../../hooks";
import { useZrxQuoteMutation } from "../../hooks/zrx";
import { BigNumberUtils } from "../../utils";
import DurationSelect from "./DurationSelect";
import ReviewOrderDialog from "./ReviewOrderDialog";

export interface BuyFormProps {
  makerToken: Token;
  takerToken: Token;
  makerTokenBalance?: ethers.BigNumber;
  maker?: string;
  provider?: ethers.providers.Web3Provider;
}

export default function BuyForm({
  makerToken,
  takerToken,
  makerTokenBalance,
  maker,
  provider,
}: BuyFormProps) {
  const [amount, setAmount] = useState("0.0");
  const [amountPerToken, setAmountPerToken] = useState("0.0");
  const [duration, setDuration] = useState(ORDER_LIMIT_DURATIONS[0].value);

  const [showReview, setShowReview] = useState(false);

  const handleChangeAmount = (value: string) => setAmount(value);

  const handleChangeAmountPerToken = (value: string) =>
    setAmountPerToken(value);

  const handleChangeDuration = (value: number) => setDuration(value);

  const parsedAmount = useMemo(() => {
    return parseFloat(amount !== "" ? amount : "0.0");
  }, [amount]);

  const parsedAmountPerToken = useMemo(() => {
    return ethers.utils.parseUnits(
      amountPerToken || "0.0",
      makerToken.decimals
    );
  }, [amountPerToken, makerToken]);

  const cost = useMemo(() => {
    return new BigNumberUtils().multiply(parsedAmountPerToken, parsedAmount);
  }, [parsedAmountPerToken, parsedAmount]);

  const hasSufficientBalance = useMemo(() => {
    return makerTokenBalance?.gte(cost) && !cost.isZero();
  }, [cost, makerTokenBalance]);

  const formattedCost = useMemo(() => {
    return ethers.utils.formatUnits(cost, makerToken.decimals);
  }, [makerToken, cost]);

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
        id="buy.symbol"
        defaultMessage="buy {symbol}"
        values={{ symbol: takerToken.symbol }}
      />
    );
  }, [hasSufficientBalance, takerToken, makerToken, cost]);

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

    const sellAmount = BigNumber.from(quote.sellAmount);

    setAmountPerToken(
      ethers.utils.formatUnits(sellAmount, makerToken.decimals)
    );
  };

  const sendLimitOrderMutation = useSendLimitOrderMutation();

  const handleBuy = () => {
    setShowReview(true);
  };

  const { formatMessage } = useIntl();

  const { enqueueSnackbar } = useSnackbar();

  const handleConfirmBuy = async () => {
    if (!chainId || !maker || !makerToken || !provider) {
      return;
    }

    try {
      await sendLimitOrderMutation.mutateAsync({
        chainId: chainId as number,
        expirationTime: duration,
        maker,
        makerAmount: cost.toString(),
        makerToken: makerToken.contractAddress,
        provider,
        takerAmount: ethers.utils
          .parseUnits(parsedAmount.toString(), takerToken.decimals)
          .toString(),
        takerToken: takerToken.contractAddress,
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

  const handleCloseReview = () => {
    setShowReview(false);
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
        amount={parsedAmount}
        amountPerToken={parsedAmountPerToken}
        makerToken={makerToken}
        takerToken={takerToken}
        isPlacingOrder={sendLimitOrderMutation.isLoading}
        onConfirm={handleConfirmBuy}
      />
      <Stack spacing={2}>
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
                amount: makerTokenBalance
                  ? ethers.utils.formatUnits(
                      makerTokenBalance,
                      makerToken.decimals
                    )
                  : "0.0",
                symbol: makerToken.symbol.toUpperCase(),
              }}
            />
          </Typography>
          <IconButton onClick={handleQuotePrice} size="small">
            <RefreshIcon />
          </IconButton>
        </Stack>
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
            <FormattedMessage id="cost" defaultMessage="Cost" />
          </Typography>
          <Typography variant="body1">
            {formattedCost} {makerToken.symbol.toUpperCase()}
          </Typography>
        </Stack>
        {!cost.isZero() && (
          <Button
            disabled={!hasSufficientBalance}
            onClick={handleBuy}
            fullWidth
            variant="contained"
          >
            {buttonMessage}
          </Button>
        )}
      </Stack>
    </>
  );
}
