import axios, { AxiosInstance } from "axios";
import { ChainId } from "../../constants/enum";
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

  constructor(chainId: ChainId) {
    this.axiosInstance = axios.create({ baseURL: ZERO_EX_URL(chainId) });
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
