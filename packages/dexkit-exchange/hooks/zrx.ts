import { useMutation, useQuery } from "@tanstack/react-query";

import { ChainId } from "@dexkit/core";
import { ZeroExApiClient } from "@dexkit/core/services/zrx";
import {
  ZeroExQuote,
  ZrxOrderbookResponse,
} from "@dexkit/core/services/zrx/types";
import { useContext } from "react";
import { DexkitExchangeContext } from "../contexts";
import { getZrxExchangeAddress } from "../utils";

import { ZrxOrder } from "@dexkit/core/services/zrx/types";
import { Contract, ethers } from "ethers";
import { ZRX_EXCHANGE_ABI } from "../constants/zrx";

export function useZrxQuoteMutation({ chainId }: { chainId?: ChainId }) {
  const { zrxApiKey } = useContext(DexkitExchangeContext);

  return useMutation(async (params: ZeroExQuote) => {
    if (!chainId) {
      throw new Error("is not connected");
    }

    const zrxClient = new ZeroExApiClient(chainId, zrxApiKey);

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
  const { zrxApiKey } = useContext(DexkitExchangeContext);

  return useQuery<ZrxOrderbookResponse | null>(
    [ZRX_ORDERBOOK_QUERY, account, chainId],
    async () => {
      if (!chainId) {
        return null;
      }

      const zrxClient = new ZeroExApiClient(chainId, zrxApiKey);

      return await zrxClient.orderbook({ trader: account });
    }
  );
}

export function useZrxCancelOrderMutation() {
  const { zrxApiKey } = useContext(DexkitExchangeContext);

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

      return tx.hash;
    }
  );
}
