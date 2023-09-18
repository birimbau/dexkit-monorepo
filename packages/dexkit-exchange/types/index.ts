import { Token } from "@dexkit/core/types";
import { ethers } from "ethers";

import * as Yup from "yup";

export type DexkitExchangeSettings = {
  zrxApiKey?: string;
  quoteToken?: Token;
  defaultPairs: { [key: number]: { quoteToken: Token; baseToken: Token } };
  defaultTokens: {
    [key: number]: { quoteTokens: Token[]; baseTokens: Token[] };
  };
  buyTokenPercentageFee?: number;
  feeRecipient?: string;
  affiliateAddress?: string;
};

export type DexkitExchangeContextState = {
  zrxApiKey?: string;
  quoteToken?: Token;
  baseToken?: Token;
  baseTokens: Token[];
  quoteTokens: Token[];
  buyTokenPercentageFee?: number;
  feeRecipient?: string;
  affiliateAddress?: string;
  tokens?: { [key: string]: Token };
  setPair: (baseToken: Token, quoteToken: Token) => void;
};

export type GtPool = {
  id: string;
  type: string;
  attributes: {
    base_token_price_usd: string;
    base_token_price_native_currency: string;
    quote_token_price_usd: string;
    quote_token_price_native_currency: string;
    address: string;
    name: string;
    reserve_in_usd: string;
    pool_created_at: null;
    token_price_usd: string;
    fdv_usd: string;
    market_cap_usd: string;
    price_change_percentage: {
      h1: string;
      h24: string;
    };
    transactions: {
      h1: {
        buys: number;
        sells: number;
      };
      h24: {
        buys: number;
        sells: number;
      };
    };
    volume_usd: {
      h24: string;
    };
  };
};

export type GtTopPoolsApiResponse = {
  data: GtPool[];
};

export const TokenSchema = Yup.object().shape({
  contractAddress: Yup.string(),
  chainId: Yup.number(),
  symbol: Yup.string(),
  name: Yup.string(),
});

export const ExchangeSettingsSchema = Yup.object({
  zrxApiKey: Yup.string().required(),
  defaultTokens: Yup.object().required(),
  defaultPairs: Yup.object().required(),
  buyTokenPercentageFee: Yup.number().required(),
  feeRecipient: Yup.string()
    .test("address", (value) => {
      return value !== undefined ? ethers.utils.isAddress(value) : true;
    })
    .optional(),
  affiliateAddress: Yup.string()
    .test("address", (value) => {
      return value !== undefined ? ethers.utils.isAddress(value) : true;
    })
    .required(),
});

export type ExchangeSettingsFormType = Yup.InferType<
  typeof ExchangeSettingsSchema
>;
