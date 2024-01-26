import { ethers } from "ethers";

import { ERC20Abi } from "../constants/abis";

import { NETWORK_COIN_SYMBOL_SERVER } from "../constants/networks";
import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "../constants/zrx";

export const getERC20Decimals = async (
  contractAddress?: string,
  provider?: ethers.providers.BaseProvider
) => {
  if (contractAddress === undefined || provider === undefined) {
    return;
  }

  if (contractAddress === ZEROEX_NATIVE_TOKEN_ADDRESS) {
    return 18;
  }

  const contract = new ethers.Contract(contractAddress, ERC20Abi, provider);

  return await contract.decimals();
};

export const getERC20Symbol = async (
  contractAddress?: string,
  provider?: ethers.providers.BaseProvider
) => {
  if (contractAddress === undefined || provider === undefined) {
    return;
  }

  if (contractAddress === ZEROEX_NATIVE_TOKEN_ADDRESS) {
    return NETWORK_COIN_SYMBOL_SERVER((await provider.getNetwork()).chainId);
  }

  const contract = new ethers.Contract(contractAddress, ERC20Abi, provider);

  return await contract.symbol();
};

export const getERC20Name = async (
  contractAddress?: string,
  provider?: ethers.providers.BaseProvider
) => {
  if (contractAddress === undefined || provider === undefined) {
    return;
  }

  const contract = new ethers.Contract(contractAddress, ERC20Abi, provider);

  return await contract.name();
};

export const getERC20Balance = async (
  contractAddress?: string,
  account?: string,
  provider?: ethers.providers.BaseProvider
) => {
  if (
    contractAddress === undefined ||
    account === undefined ||
    provider === undefined
  ) {
    return;
  }

  if (contractAddress === ZEROEX_NATIVE_TOKEN_ADDRESS) {
    return await provider.getBalance(account);
  }

  const contract = new ethers.Contract(contractAddress, ERC20Abi, provider);

  return await contract.balanceOf(account);
};

export const approveToken = async ({
  provider,
  spender,
  tokenContract,
  amount,
}: {
  provider?: ethers.providers.Web3Provider;
  spender?: string;
  tokenContract?: string;
  amount?: ethers.BigNumber;
}) => {
  if (!tokenContract || !provider || !spender || !amount) {
    return;
  }

  const contract = new ethers.Contract(
    tokenContract,
    ERC20Abi,
    provider.getSigner()
  );

  return await contract.approve(spender, amount);
};
