import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { useEffect } from "react";

import { useBlockNumber } from "@dexkit/core/hooks";
import { useSwapState } from "../modules/swap/hooks";
import { useGaslessTradeStatusMutation } from "../modules/swap/hooks/useGaslessTradeStatusMutation";
import { useGaslessTrades } from "../modules/swap/hooks/useGaslessTrades";

export default function GaslessTradesUpdater() {
  const { chainId } = useWeb3React();

  const [gaslessTrades, setGaslessTrades] = useGaslessTrades();

  const { onNotification } = useSwapState();

  const statusMutation = useGaslessTradeStatusMutation({});

  const blockNumber = useBlockNumber();

  useEffect(() => {
    if (chainId !== undefined && blockNumber !== undefined && gaslessTrades) {
      for (let index = 0; index < gaslessTrades.length; index++) {
        async function fetchTradeStatus() {
          const trade = gaslessTrades[index];
          if (!trade.mutationCalled) {
            trade.mutationCalled = true;
            try {
              const status = await statusMutation.mutateAsync({
                tradeHash: trade.tradeHash,
                chainId: trade.chainId,
              });

              if (
                status?.status === "succeeded" ||
                status?.status === "confirmed" ||
                status?.status === "failed"
              ) {
                if (status.status !== "failed") {
                  onNotification({
                    hash: status.transactions[0].hash,
                    chainId: trade.chainId,
                    title: "",
                    params: {
                      type: "swap",
                      sellAmount: trade.values.sellAmount,
                      buyAmount: trade.values.buyAmount,
                      sellToken: trade.values.sellToken,
                      buyToken: trade.values.buyToken,
                    },
                  });
                }
                setGaslessTrades(
                  gaslessTrades.filter((t) => t.tradeHash !== trade.tradeHash)
                );
              } else {
                gaslessTrades[index].mutationCalledTimes =
                  (trade.mutationCalledTimes ? trade.mutationCalledTimes : 0) +
                  1;

                gaslessTrades[index].mutationCalled = false;
                setGaslessTrades(gaslessTrades);
              }
            } catch {
              gaslessTrades[index].mutationCalledTimes =
                (trade.mutationCalledTimes ? trade.mutationCalledTimes : 0) + 1;

              gaslessTrades[index].mutationCalled = false;
              setGaslessTrades(gaslessTrades);
            }

            // If we call several times, maybe this trade is broken
            if (trade.mutationCalledTimes && trade.mutationCalledTimes > 20) {
              setGaslessTrades(
                gaslessTrades.filter((t) => t.tradeHash !== trade.tradeHash)
              );
            }
          }
        }

        fetchTradeStatus();
      }
    }
  }, [blockNumber, chainId]);

  return null;
}
