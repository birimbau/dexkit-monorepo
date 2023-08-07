import { ChainId } from "@dexkit/core";
import { ethers } from "ethers";

import { BigNumber } from "bignumber.js";

import { useMutation } from "@tanstack/react-query";
import { createZrxOrder } from "../utils";

import {
  ZEROEX_ORDERBOOK_ENDPOINT,
  ZERO_EX_URL,
} from "@dexkit/core/services/zrx/constants";
import axios from "axios";
import { useContext } from "react";
import { DexkitExchangeContext } from "../contexts";

export function useExchangeContext() {
  return useContext(DexkitExchangeContext);
}

export function useSendLimitOrderMutation() {
  const context = useExchangeContext();

  return useMutation(
    async ({
      expirationTime,
      makerAmount,
      makerToken,
      provider,
      takerAmount,
      takerToken,
      chainId,
      maker,
    }: {
      expirationTime: number;
      makerAmount: string;
      makerToken: string;
      provider: ethers.providers.Web3Provider;
      takerAmount: string;
      takerToken: string;
      chainId: ChainId;
      maker: string;
    }) => {
      if (!maker) {
        return null;
      }

      const signedOrder = await createZrxOrder({
        maker,
        chainId,
        expirationTime,
        makerAmount: new BigNumber(makerAmount),
        makerToken,
        provider,
        takerAmount: new BigNumber(takerAmount),
        takerToken,
      });

      const resp = await axios.post(
        `${ZERO_EX_URL(chainId)}/${ZEROEX_ORDERBOOK_ENDPOINT}`,
        signedOrder,
        context.zrxApiKey
          ? { headers: { "0x-api-key": context.zrxApiKey } }
          : undefined
      );

      return resp.data;
    }
  );
}
