import MultiCall, { TokenBalances } from "@indexed-finance/multicall";
import { ethers } from "ethers";
import { COINGECKO_ENDPOIT, COINGECKO_PLATFORM_ID } from "../constants";
import { ERC20Abi } from "../constants/abis";
import { ChainId } from "../constants/enum";
import { Token, TokenPrices } from "../types";
import { isAddressEqual } from "../utils";
import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "./zeroex/constants";

import axios from "axios";

export const getERC20TokenAllowance = async (
  provider: ethers.providers.BaseProvider,
  tokenAddress: string,
  account: string,
  spender: string
): Promise<ethers.BigNumber> => {
  const contract = new ethers.Contract(tokenAddress, ERC20Abi, provider);

  return await contract.allowance(account, spender);
};

export const hasSufficientAllowance = async ({
  spender,
  tokenAddress,
  amount,
  account,
  provider,
}: {
  account?: string;
  spender: string;
  tokenAddress: string;
  amount: ethers.BigNumber;
  provider?: ethers.providers.BaseProvider;
}) => {
  if (!provider || !account) {
    throw new Error("no provider or account");
  }

  if (isAddressEqual(spender, ethers.constants.AddressZero)) {
    return true;
  }

  const allowance = await getERC20TokenAllowance(
    provider,
    tokenAddress,
    account,
    spender
  );

  return allowance.gte(amount);
};

export async function getTokensBalance(
  tokens: Token[],
  provider: ethers.providers.BaseProvider,
  account: string
): Promise<TokenBalances> {
  await provider.ready;

  const multicall = new MultiCall(provider);

  const [, balances] = await multicall.getBalances(
    tokens.map((t) => {
      if (isAddressEqual(t.contractAddress, ZEROEX_NATIVE_TOKEN_ADDRESS)) {
        return ethers.constants.AddressZero;
      }

      return t.contractAddress;
    }),
    account
  );

  return balances;
}

export const getTokenPrices = async ({
  chainId,
  addresses,
  currency = "usd",
}: {
  chainId: ChainId;
  addresses: string[];
  currency: string;
}): Promise<{ [key: string]: { [key: string]: number } }> => {
  const platformId = COINGECKO_PLATFORM_ID[chainId];
  if (!platformId) {
    return {};
  }

  const priceResponce = await axios.get(
    `${COINGECKO_ENDPOIT}/simple/token_price/${platformId}?contract_addresses=${addresses.join(
      ","
    )}&vs_currencies=${currency}`
  );

  return priceResponce.data as { [key: string]: { [key: string]: number } };
};

export const getCoinPrices = async ({
  tokens,
  currency = "usd",
}: {
  tokens: Token[];
  currency: string;
}): Promise<TokenPrices> => {
  const priceResponce = (
    await axios.get<{ [key: string]: { [key: string]: number } }>(
      `${COINGECKO_ENDPOIT}/simple/price?ids=${tokens
        .map((c) => c.coingeckoId)
        .join(",")}&vs_currencies=${currency}`
    )
  ).data;

  const results: TokenPrices = {};

  for (const key of Object.keys(priceResponce)) {
    const result = priceResponce[key];
    const amount = result[currency];
    const token = tokens.find((c) => c.coingeckoId === key);

    if (token?.chainId) {
      results[token.chainId] = {
        [isAddressEqual(token.contractAddress, ZEROEX_NATIVE_TOKEN_ADDRESS)
          ? ethers.constants.AddressZero
          : token.contractAddress]: { [currency]: amount },
      };
    }
  }

  return results;
};

export async function getPricesByChain(
  chainId: ChainId,
  tokens: Token[],
  currency: string
): Promise<TokenPrices> {
  return await getCoinPrices({
    tokens,
    currency,
  });
}
