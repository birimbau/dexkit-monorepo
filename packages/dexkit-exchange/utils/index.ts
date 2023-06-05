import utils, { SignatureType } from "@0x/protocol-utils";
import { ChainId } from "@dexkit/core";
import { BigNumber } from "bignumber.js";
import { ethers } from "ethers";

export const getExpirationTimeFromSeconds = (seconds: BigNumber) => {
  return new BigNumber(
    Math.floor(new Date().valueOf() / 1000) + seconds.toNumber()
  );
};

export interface CreateZrxOrderParams {
  provider: ethers.providers.Web3Provider;
  chainId: ChainId;
  maker: string;
  makerToken: string;
  takerToken: string;
  makerAmount: BigNumber;
  takerAmount: BigNumber;
  expirationTime: number;
}

export async function createZrxOrder({
  maker,
  provider,
  chainId,
  makerToken,
  takerToken,
  makerAmount,
  takerAmount,
  expirationTime,
}: CreateZrxOrderParams) {
  let order = new utils.LimitOrder({
    makerToken,
    takerToken,
    makerAmount, // NOTE: This is 1 WEI, 1 ETH would be 1000000000000000000
    takerAmount, // NOTE this is 0.001 ZRX. 1 ZRX would be 1000000000000000000
    maker: maker,
    sender: ethers.constants.AddressZero,
    expiry: new BigNumber(
      getExpirationTimeFromSeconds(new BigNumber(expirationTime))
    ),
    chainId,
  });

  const signature = order.getSignatureWithProviderAsync(
    provider,
    SignatureType.EIP712
  );

  return { ...order, signature };
}
