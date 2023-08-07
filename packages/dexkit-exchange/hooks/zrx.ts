import { useMutation } from "@tanstack/react-query";

import { ChainId } from "@dexkit/core";
import { ZeroExApiClient } from "@dexkit/core/services/zrx";
import { ZeroExQuote } from "@dexkit/core/services/zrx/types";

export function useZrxQuoteMutation({ chainId }: { chainId?: ChainId }) {
  return useMutation(async (params: ZeroExQuote) => {
    if (!chainId) {
      throw new Error("is not connected");
    }

    const zrxClient = new ZeroExApiClient(
      chainId,
      "fbae4da9-8c42-4cb5-b887-9796f05980b9"
    );

    return zrxClient.quote(params, {});
  });
}
