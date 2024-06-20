import { NETWORK_COIN_SYMBOL } from "@dexkit/core/constants/networks";
import { formatStringNumber } from "@dexkit/core/utils/formatStringNumber";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { Typography } from "@mui/material";
import { useMemo } from "react";
import { formatEther } from "viem";
import { useBalance } from "wagmi";

export interface AccountBalanceProps {
  isBalancesVisible: boolean;
}

export function AccountBalance({ isBalancesVisible }: AccountBalanceProps) {
  const { account, chainId } = useWeb3React();

  const balanceQuery = useBalance({
    address: account,
  });

  const formattedBalance = useMemo(() => {
    if (balanceQuery && balanceQuery.data) {
      return formatStringNumber({
        value: formatEther(balanceQuery.data?.value),
      });
    }

    return "0.00";
  }, [balanceQuery]);
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
