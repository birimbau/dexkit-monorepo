import axios, { AxiosInstance, AxiosRequestHeaders } from "axios";
import { ChainId } from "../../constants/enums";

import {
  ZEROEX_QUOTE_ENDPOINT,
  ZEROEX_TOKENS_ENDPOINT,
  ZERO_EX_URL,
} from "./constants";

import { ZeroExQuote, ZeroExQuoteResponse } from "./types";

export function getZeroExApiClient(chainId: ChainId) {
  return new ZeroExApiClient(chainId);
}

export class ZeroExApiClient {
  private axiosInstance: AxiosInstance;

  constructor(chainId: ChainId, zeroExApiKey?: string) {
    const headers: AxiosRequestHeaders = {};

    if (zeroExApiKey) {
      headers["0x-api-key"] = zeroExApiKey;
    }

    this.axiosInstance = axios.create({
      baseURL: ZERO_EX_URL(chainId),
      headers,
    });
  }

  async quote(
    quote: ZeroExQuote,
    { signal }: { signal?: AbortSignal }
  ): Promise<ZeroExQuoteResponse> {
    const resp = await this.axiosInstance.get(ZEROEX_QUOTE_ENDPOINT, {
      params: quote,
      signal,
    });

    return resp.data;
  }

  async tokens(): Promise<any> {
    return this.axiosInstance.get(ZEROEX_TOKENS_ENDPOINT);
  }
}
