import { ChainId } from "@dexkit/core/constants";
import { UserEvents } from "@dexkit/core/constants/userEvents";
import { Token } from "@dexkit/core/types";
import { useTrackUserEventsMutation } from "@dexkit/ui/hooks/userEvents";
import { SiteContext } from "@dexkit/ui/providers/SiteProvider";
import { ZeroExApiClient } from "@dexkit/zrx-swap/services";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { useIntl } from "react-intl";

export function useMarketTradeGaslessExec({
  onNotification,

}: {
  onNotification: (params: any) => void;
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
    }: { quote: any, trade: any, approval?: any, chainId?: number, sellToken: Token, buyToken: Token }) => {
      if (!chainId) {
        return null
      }


      const client = new ZeroExApiClient(chainId, process.env.NEXT_PUBLIC_ZRX_API_KEY, siteId);

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


export function useMarketGaslessTradeStatusQuery({
  tradeHash,
  chainId,
}: {
  chainId?: ChainId,
  tradeHash: string | undefined
}) {

  const { siteId } = useContext(SiteContext);


  return useQuery([tradeHash], async ({ signal }) => {
    if (!tradeHash || !chainId) {
      return null
    }

    const client = new ZeroExApiClient(chainId, process.env.NEXT_PUBLIC_ZRX_API_KEY, siteId);

    try {

      const status = await client.submitStatusGasless({ tradeHash }, { signal });

      return status;

    } catch (err) {
      throw err;
    }
  }, { refetchInterval: 2000 }
  );
}