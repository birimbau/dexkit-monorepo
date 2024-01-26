import { ChainId } from "@dexkit/core/constants/enums";
import axios, { AxiosInstance, AxiosRequestHeaders } from "axios";

import {
  ZEROEX_QUOTE_ENDPOINT,
  ZEROEX_TOKENS_ENDPOINT,
  ZERO_EX_URL,
} from "./constants";

import { Network } from "@dexkit/core/types";
import { ZeroExQuote, ZeroExQuoteResponse } from "./types";

export function getZeroExApiClient(chainId: ChainId) {
  return new ZeroExApiClientCurr(chainId);
}

export class ZeroExApiClientCurr {
  private axiosInstance: AxiosInstance;

  constructor(
    private chainId: ChainId,
    zeroExApiKey?: string,
    private siteId?: number,
    private NETWORKS?: { [key: number]: Network }
  ) {
    const headers: AxiosRequestHeaders = {};

    if (zeroExApiKey) {
      headers["0x-api-key"] = zeroExApiKey;
    }

    this.axiosInstance = axios.create({
      headers,
    });
  }

  async quote(
    quote: ZeroExQuote,
    { signal }: { signal?: AbortSignal }
  ): Promise<ZeroExQuoteResponse> {
    const resp = await this.axiosInstance.get(
      ZERO_EX_URL(this.chainId, this.siteId, this.NETWORKS) +
        ZEROEX_QUOTE_ENDPOINT,
      {
        params: quote,
        signal,
      }
    );

    return resp.data;
  }

  async tokens(): Promise<any> {
    return this.axiosInstance.get(
      ZERO_EX_URL(this.chainId, this.siteId, this.NETWORKS) +
        ZEROEX_TOKENS_ENDPOINT
    );
  }
}
