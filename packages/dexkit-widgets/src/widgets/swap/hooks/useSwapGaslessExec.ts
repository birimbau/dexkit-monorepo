import { ChainId } from "@dexkit/core";
import { UserEvents } from "@dexkit/core/constants/userEvents";
import { Token } from "@dexkit/core/types";
import { useTrackUserEventsMutation } from "@dexkit/ui/hooks/userEvents";
import { SiteContext } from "@dexkit/ui/providers/SiteProvider";
import { ZeroExApiClient } from "@dexkit/zrx-swap/services";
import { ZeroExQuoteGasless } from "@dexkit/zrx-swap/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { useIntl } from "react-intl";
import { NotificationCallbackParams } from "../types";

export interface SwapGaslessExecParams {
  quote: ZeroExQuoteGasless;
  trade: any;
  approval: any;
  chainId: ChainId;
  onHash: (hash: string) => void;
  sellToken: Token;
  buyToken: Token;
}

export function useSwapGaslessExec({
  onNotification,
  zeroExApiKey
}: {
  zeroExApiKey?: string
  onNotification: (params: NotificationCallbackParams) => void;
}) {

  const { siteId } = useContext(SiteContext);

  const { formatMessage } = useIntl();
  const trackUserEvent = useTrackUserEventsMutation();

  return useMutation(
    async ({
      quote,
      trade,
      approval,
      chainId,
      sellToken,
      buyToken,
    }: SwapGaslessExecParams) => {
      if (!zeroExApiKey) {
        throw new Error("no api key");
      }
      const client = new ZeroExApiClient(chainId, zeroExApiKey, siteId);

      try {

        const { tradeHash } = await client.submitGasless({ trade, approval })

        onNotification({
          chainId,
          title: formatMessage({
            id: "swap.tokens",
            defaultMessage: "Swap Tokens", // TODO: add token symbols and amounts
          }),
          params: {
            type: "swapGasless",
            sellAmount: quote.sellAmount as string,
            buyAmount: quote.buyAmount as string,
            sellToken,
            buyToken,
          },
        });

        trackUserEvent.mutate({
          event: UserEvents.gaslessSwap,
          chainId,
          metadata: JSON.stringify({
            tradeHash: tradeHash,
            quote: quote,
            sellToken,
            buyToken,
          }),
        })


        return tradeHash
      } catch (err) {
        throw err;
      }
    }
  );
}

export function useSwapGaslessTradeStatusQuery({
  zeroExApiKey,
  tradeHash,
  chainId,
}: {
  chainId?: ChainId,
  zeroExApiKey?: string,
  tradeHash: string | undefined
}) {

  const { siteId } = useContext(SiteContext);


  return useQuery([tradeHash], async ({ signal }) => {
    if (!zeroExApiKey) {
      throw new Error("no api key");
    }
    if (!tradeHash || !chainId) {
      return null
    }

    const client = new ZeroExApiClient(chainId, zeroExApiKey, siteId);

    try {

      const status = await client.submitStatusGasless({ tradeHash }, { signal });

      return status;

    } catch (err) {
      throw err;
    }
  }, { refetchInterval: 2000 }
  );
}
