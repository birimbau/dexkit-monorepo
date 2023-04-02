import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "@dexkit/core/constants/zrx";
import { BigNumber, ethers } from "ethers";
import { ERC20Abi } from "../../constants/abis";

export const getERC20Balance = async (
  contractAddress?: string,
  account?: string,
  provider?: ethers.providers.BaseProvider
): Promise<BigNumber | undefined> => {
  if (
    contractAddress === undefined ||
    account === undefined ||
    provider === undefined
  ) {
    return BigNumber.from(0);
  }

  if (contractAddress === ZEROEX_NATIVE_TOKEN_ADDRESS) {
    return await provider.getBalance(account);
  }

  const contract = new ethers.Contract(contractAddress, ERC20Abi, provider);

  return await contract.balanceOf(account);
};