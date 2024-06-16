import { Box, Button, InputBaseProps, Stack, Typography } from "@mui/material";
import { BigNumber } from "ethers";
import { FormattedMessage } from "react-intl";

import { Token } from "@dexkit/core/types";
import React from "react";
import { formatBigNumber } from "../../../utils";
import { CurrencyField } from "../CurrencyField";
import SwapTokenButtonMatcha from "./SwapTokenButtonMatcha";

import SelectTokenShortcutMatcha from "./SelectTokenShortcutMatcha";

export interface SwapTokenFieldMatchaProps {
  InputBaseProps?: InputBaseProps;
  disabled?: boolean;
  onChange: (value: BigNumber, clickOnMax?: boolean) => void;
  token?: Token;
  onSelectToken: (token?: Token) => void;
  value: BigNumber;
  balance?: BigNumber;
  showBalance?: boolean;
  isUserInput?: boolean;
  title?: React.ReactNode;
  isBuyToken?: boolean;
  onSetToken?: (token?: Token) => void;
}

function SwapTokenFieldMatcha({
  InputBaseProps,
  onChange,
  onSelectToken,
  token,
  value,
  disabled,
  balance,
  showBalance,
  isUserInput,
  title,
  isBuyToken,
  onSetToken,
}: SwapTokenFieldMatchaProps) {
  const handleMax = () => {
    if (balance) {
      onChange(balance, true);
    }
  };

  return (
    <Box
      sx={(theme) => ({
        px: 2,
        py: 1,
        borderRadius: theme.shape.borderRadius / 2,
        "&:focus-within": {
          borderColor: theme.palette.primary.main,
          borderWidth: 2,
        },
      })}
    >
      <Stack spacing={2}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          justifyContent="space-between"
        >
          <Typography component="div" variant="caption" color="text.secondary">
            {title}
          </Typography>
          {token && balance && showBalance && (
            <Stack
              direction="row"
              spacing={0.5}
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                variant="caption"
                color="text.secondary"
                align="right"
              >
                <FormattedMessage
                  id="token.balance.balance"
                  defaultMessage="Balance: {balance}"
                  values={{
                    balance: formatBigNumber(balance, token?.decimals),
                  }}
                />
              </Typography>
            </Stack>
          )}
        </Stack>

        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <SwapTokenButtonMatcha
            token={token}
            ButtonBaseProps={{ onClick: () => onSelectToken(token) }}
          />
          {token && balance && showBalance ? (
            <Button
              variant="contained"
              color="inherit"
              onClick={handleMax}
              size="small"
              disableElevation
              disableTouchRipple
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.palette.background.default
                    : theme.palette.grey[200],
                borderRadius: (theme) => theme.shape.borderRadius,
              }}
            >
              <FormattedMessage id="max" defaultMessage="Max" />
            </Button>
          ) : isBuyToken ? (
            <SelectTokenShortcutMatcha
              onSelectToken={(token) => onSetToken!(token)}
            />
          ) : null}
        </Stack>
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        spacing={4}
        justifyContent="space-between"
      >
        <CurrencyField
          InputBaseProps={{
            ...InputBaseProps,
            sx: { fontSize: "2rem", flex: 1 },
            disabled,
          }}
          onChange={onChange}
          value={value}
          isUserInput={isUserInput}
          decimals={token?.decimals}
        />
        <Typography variant="caption" color="text.secondary">
          $30,00
        </Typography>
      </Stack>
    </Box>
  );
}

export default SwapTokenFieldMatcha;
