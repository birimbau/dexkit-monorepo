import { ChainId } from "@dexkit/core";
import { ethers } from "ethers";

import { BigNumber } from "bignumber.js";

import { useMutation } from "@tanstack/react-query";
import { createZrxOrder } from "../utils";

export function useSignLimitOrderMutation() {
  return useMutation(
    async (params: {
      provider: ethers.providers.Web3Provider;
      chainId: ChainId;
      maker: string;
      makerToken: string;
      takerToken: string;
      makerAmount: BigNumber;
      takerAmount: BigNumber;
      expirationTime: number;
    }) => createZrxOrder(params)
  );
}

export function useSendLimitOrderMutation({
  maker,
}: {
  maker: string;
  chainId: ChainId;
}) {
  return useMutation(
    async ({
      expirationTime,
      makerAmount,
      makerToken,
      provider,
      takerAmount,
      takerToken,
      chainId,
    }: {
      expirationTime: number;
      makerAmount: string;
      makerToken: string;
      provider: ethers.providers.Web3Provider;
      takerAmount: string;
      takerToken: string;
      chainId: ChainId;
    }) => {
      const order = await createZrxOrder({
        maker,
        chainId,
        expirationTime,
        makerAmount: new BigNumber(makerAmount),
        makerToken,
        provider,
        takerAmount: new BigNumber(takerAmount),
        takerToken,
      });

      return;
    }
  );
}
