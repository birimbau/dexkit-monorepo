import { Box, InputBaseProps, Link, Stack, Typography } from "@mui/material";
import { BigNumber } from "ethers";
import { FormattedMessage } from "react-intl";
import { Token } from "../../types";
import { formatBigNumber } from "../../utils";
import { CurrencyField } from "./CurrencyField";
import SwapTokenButton from "./SwapTokenButton";

export interface SwapTokenFieldProps {
  InputBaseProps?: InputBaseProps;
  onChange: (value: BigNumber) => void;
  token?: Token;
  onSelectToken: (token?: Token) => void;
  value: BigNumber;
  balance?: BigNumber;
  showBalance?: boolean;
}

function SwapTokenField({
  InputBaseProps,
  onChange,
  onSelectToken,
  token,
  value,
  balance,
  showBalance,
}: SwapTokenFieldProps) {
  const handleMax = () => {
    if (balance) {
      onChange(balance);
    }
  };

  console.log("balance", balance);

  return (
    <Box
      sx={(theme) => ({
        px: 2,
        py: 1,
        borderRadius: theme.shape.borderRadius / 2,
        backgroundColor: theme.palette.grey[300],
      })}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <CurrencyField
          InputBaseProps={{
            ...InputBaseProps,
            sx: { fontSize: "2rem", flex: 1 },
          }}
          onChange={onChange}
          value={value}
          decimals={token?.decimals}
        />
        <SwapTokenButton
          token={token}
          ButtonBaseProps={{ onClick: () => onSelectToken(token) }}
        />
      </Stack>
      {token && balance && showBalance && (
        <Stack
          direction="row"
          spacing={0.5}
          justifyContent="flex-end"
          alignItems="center"
        >
          <Typography variant="body2" align="right">
            <FormattedMessage
              id="balance"
              defaultMessage="balance: {balance}"
              values={{
                balance:
                  balance && token
                    ? formatBigNumber(balance, token?.decimals)
                    : 0,
              }}
            />
          </Typography>
          <Link
            onClick={handleMax}
            variant="body2"
            sx={{
              textDecoration: "none",
              textTransform: "uppercase",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            <FormattedMessage id="max" defaultMessage="Max" />
          </Link>
        </Stack>
      )}
    </Box>
  );
}

export default SwapTokenField;
