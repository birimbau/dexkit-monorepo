import { ChainId } from "@dexkit/core";
import { ZeroExApiClient } from "@dexkit/core/services/zrx";
import {
  ZeroExQuote,
  ZrxOrderRecord,
  ZrxOrderbookResponse,
} from "@dexkit/core/services/zrx/types";
import { useTrackUserEventsMutation } from "@dexkit/ui/hooks/userEvents";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getZrxExchangeAddress } from "../utils";

import { UserEvents } from "@dexkit/core/constants/userEvents";
import { ZrxOrder } from "@dexkit/core/services/zrx/types";
import { Contract, ethers } from "ethers";
import { ZRX_EXCHANGE_ABI } from "../constants/zrx";

export function useZrxQuoteMutation({ chainId }: { chainId?: ChainId }) {
  return useMutation(async (params: ZeroExQuote) => {
    if (!chainId) {
      return null;
    }

    const zrxClient = new ZeroExApiClient(
      chainId,
      process.env.NEXT_PUBLIC_ZRX_API_KEY
    );

    return zrxClient.quote(params, {});
  });
}

export const ZRX_ORDERBOOK_QUERY = "ZRX_ORDERBOOK_QUERY";

export function useZrxOrderbook({
  chainId,
  account,
}: {
  chainId?: ChainId;
  account?: string;
}) {
  return useQuery<ZrxOrderbookResponse | null>(
    [ZRX_ORDERBOOK_QUERY, account, chainId],
    async () => {
      if (!chainId || !account) {
        return null;
      }

      const zrxClient = new ZeroExApiClient(
        chainId,
        process.env.NEXT_PUBLIC_ZRX_API_KEY
      );

      return await zrxClient.orderbook({ trader: account });
    }
  );
}

export const ZRX_ORDERBOOK_ORDER_QUERY = "ZRX_ORDERBOOK_ORDER_QUERY";

export function useZrxOrderbookOrder({
  hash,
  chainId,
}: {
  hash?: string;
  chainId?: ChainId;
}) {
  return useQuery<ZrxOrderRecord | null>(
    [ZRX_ORDERBOOK_ORDER_QUERY, hash],
    async () => {
      if (!hash || !chainId) {
        return null;
      }

      const zrxClient = new ZeroExApiClient(
        chainId,
        process.env.NEXT_PUBLIC_ZRX_API_KEY
      );

      return await zrxClient.order(hash);
    }
  );
}

export function useZrxCancelOrderMutation() {
  const trackUserEvent = useTrackUserEventsMutation();
  return useMutation(
    async ({
      chainId,
      provider,
      order,
    }: {
      chainId?: ChainId;
      provider?: ethers.providers.Web3Provider;
      order: ZrxOrder;
    }) => {
      const contractAddress = getZrxExchangeAddress(chainId);

      if (!contractAddress || !provider || !chainId) {
        throw new Error("no provider or contract address");
      }

      const contract = new Contract(
        contractAddress,
        ZRX_EXCHANGE_ABI,
        provider.getSigner()
      );

      const tx = await contract.cancelLimitOrder(order);

      trackUserEvent.mutate({
        event: UserEvents.swap,
        hash: tx.hash,
        chainId,
        metadata: JSON.stringify({
          order,
        }),
      });

      return tx.hash;
    }
  );
}
