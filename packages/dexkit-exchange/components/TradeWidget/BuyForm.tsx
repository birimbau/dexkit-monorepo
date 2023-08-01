import { Button, Divider, IconButton, Stack, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import DecimalInput from "./DecimalInput";

import { Token } from "@dexkit/core/types";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useWeb3React } from "@web3-react/core";
import { BigNumber, ethers } from "ethers";
import { ORDER_LIMIT_DURATIONS } from "../../constants";
import { useZrxQuoteMutation } from "../../hooks/zrx";
import DurationSelect from "./DurationSelect";

export interface BuyFormProps {
  makerToken: Token;
  takerToken: Token;
  makerTokenBalance?: ethers.BigNumber;
}

export default function BuyForm({
  makerToken,
  takerToken,
  makerTokenBalance,
}: BuyFormProps) {
  const [amount, setAmount] = useState("0.0");
  const [amountPerToken, setAmountPerToken] = useState("0.0");
  const [duration, setDuration] = useState(ORDER_LIMIT_DURATIONS[0].value);

  const handleChangeAmount = (value: string) => setAmount(value);

  const handleChangeAmountPerToken = (value: string) =>
    setAmountPerToken(value);

  const handleChangeDuration = (value: number) => setDuration(value);

  const parsedAmount = useMemo(() => {
    return ethers.utils.parseUnits(amount || "0.0", takerToken.decimals);
  }, [amount, takerToken]);

  const parsedAmountPerToken = useMemo(() => {
    return ethers.utils.parseUnits(
      amountPerToken || "0.0",
      makerToken.decimals
    );
  }, [amountPerToken, makerToken]);

  const cost = useMemo(() => {
    const am = parseFloat(amount);
    const amPerToken = parseFloat(amountPerToken);

    return am * amPerToken;
  }, [amount, amountPerToken]);

  const buttomMessage = useMemo(() => {
    return "Buy KIT";
  }, [parsedAmount, parsedAmountPerToken]);

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

  const handleBuy = () => {};

  return (
    <Stack spacing={2}>
      <DecimalInput
        TextFieldProps={{
          label: <FormattedMessage id="amount" defaultMessage="Amount" />,
        }}
        value={amount}
        onChange={handleChangeAmount}
      />
      <Stack direction="row" alignItems="center" justifyContent="space-between">
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
        }}
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

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="body1">
          <FormattedMessage id="cost" defaultMessage="Cost" />
        </Typography>
        <Typography variant="body1">
          {cost} {makerToken.symbol.toUpperCase()}
        </Typography>
      </Stack>
      <Button onClick={handleBuy} fullWidth variant="contained">
        {buttomMessage}
      </Button>
    </Stack>
  );
}
