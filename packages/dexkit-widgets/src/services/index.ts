import { ethers } from "ethers";
import { ERC20Abi } from "../constants/abis";
import { isAddressEqual } from "../utils";

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
  provider?: ethers.providers.Web3Provider;
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
