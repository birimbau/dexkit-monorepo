import { ethers } from 'ethers';


import { ERC20Abi } from '../constants/abis';

import { NETWORK_COIN_SYMBOL } from '../constants/networks';
import { ZEROEX_NATIVE_TOKEN_ADDRESS } from '../constants/zrx';


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
    return NETWORK_COIN_SYMBOL((await provider.getNetwork()).chainId);
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

