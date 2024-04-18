import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "@dexkit/core/constants/zrx";
import { useTokenList } from "@dexkit/ui";
import { useWeb3React } from "@web3-react/core";
import { useMemo } from "react";
import {
  useLockBalanceQuery,
  useLockKeybyOwnerQuery,
  useLockQuery,
} from "../hooks";
import BuyLock from "./BuyLock";
import BuyLockSkeleton from "./BuyLockSkeleton";

interface Props {
  lockAddress?: string;
  lockChainId?: number;
}

export default function BuyLockContainer({ lockAddress, lockChainId }: Props) {
  const { account } = useWeb3React();
  const lockQuery = useLockQuery({ lockAddress, lockChainId });

  const lockByOwner = useLockKeybyOwnerQuery({
    lockAddress,
    lockChainId,
    account,
  });

  const lockBalanceQuery = useLockBalanceQuery({
    lockAddress,
    lockChainId,
    account,
  });

  const tokens = useTokenList({ includeNative: true, chainId: lockChainId });
  const data = lockQuery.data;
  const token = useMemo(() => {
    if (data && !data?.currencyContractAddress) {
      const tk = tokens.find(
        (t) => t.address.toLowerCase() === ZEROEX_NATIVE_TOKEN_ADDRESS
      );
      if (tk) {
        return {
          name: tk?.name,
          imageUrl: tk?.logoURI,
          symbol: tk?.symbol,
        };
      }
    }

    if (data && data?.currencyContractAddress) {
      const tk = tokens.find(
        (t) =>
          t.address.toLowerCase() ===
          data?.currencyContractAddress?.toLowerCase()
      );
      if (tk) {
        return {
          name: tk?.name,
          imageUrl: tk?.logoURI,
          symbol: tk?.symbol,
        };
      }
    }
    return {};
  }, [tokens, data]);

  const isLoading =
    (lockQuery.isLoading && lockBalanceQuery.isLoading) ||
    lockByOwner.isLoading;

  return (
    <>
      {lockAddress && lockChainId && data && !isLoading && (
        <BuyLock
          lockName={data.name}
          tokenId={lockByOwner.data?.tokenId}
          lockAddress={lockAddress}
          lockChainId={lockChainId}
          price={data.keyPrice}
          remainingTickets={
            data.maxNumberOfKeys === -1
              ? -1
              : data.maxNumberOfKeys - data.outstandingKeys
          }
          token={token}
          currencyAddress={data.currencyContractAddress}
        />
      )}
      {isLoading && <BuyLockSkeleton />}
    </>
  );
}
