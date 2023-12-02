import { useEvmNativeBalanceQuery } from "@dexkit/core";

import { formatBigNumber } from "@dexkit/core/utils";
import { Typography } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { useMemo } from "react";

import { NETWORK_COIN_SYMBOL } from "@dexkit/core/constants/networks";

export interface AccountBalanceProps {
  isBalancesVisible: boolean;
}

export function AccountBalance({ isBalancesVisible }: AccountBalanceProps) {
  const { account, provider, chainId } = useWeb3React();

  const { data: balance } = useEvmNativeBalanceQuery({ provider, account });

  const formattedBalance = useMemo(() => {
    if (balance) {
      return formatBigNumber(balance);
    }

    return "0.00";
  }, [balance]);

  return (
    <Typography
      color="text.secondary"
      variant="caption"
      align="left"
      component="div"
    >
      {isBalancesVisible ? formattedBalance : "*.**"}{" "}
      {NETWORK_COIN_SYMBOL(chainId)}
    </Typography>
  );
}
