import { getContractAddressesForChainOrThrow } from '@0x/contract-addresses';
import { ChainId } from '@dexkit/core/constants';
import { BigNumber, Contract, ethers } from 'ethers';
import { Interface } from 'ethers/lib/utils';
import { NETWORKS } from 'src/constants/chain';
import { DEXKIT } from 'src/constants/dexkit';
import {
  MULTICALL_NATIVE_TOKEN_ADDRESS,
  ZEROEX_NATIVE_TOKEN_ADDRESS
} from '../constants';
import { ERC20Abi } from '../constants/abis';
import { Token, TokenBalance } from '../types/blockchain';
import { getChainIdFromSlug, getNativeCurrencySymbol } from '../utils/blockchain';
import {
  getMulticallTokenBalances,
  getMulticallTokenBalancesAndAllowances
} from './multical';

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
    return getNativeCurrencySymbol((await provider.getNetwork()).chainId);
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

export const getERC20Balances = async (
  account: string,
  tokens: Token[],
  chainId: ChainId,
  provider: ethers.providers.JsonRpcProvider
) => {
  const tokensByChainId = tokens.filter((t) => Number(t.chainId) === chainId);

  // Add here native token address
  const tokenAddressesWithNative = [
    MULTICALL_NATIVE_TOKEN_ADDRESS,
    ...tokensByChainId
      .filter((t) => t.address.toLowerCase() !== ZEROEX_NATIVE_TOKEN_ADDRESS)
      .map((t) => t.address.toLowerCase()),
  ];

  const multicallBalanceResult = await getMulticallTokenBalances(
    tokenAddressesWithNative,
    account,
    provider
  );

  if (multicallBalanceResult) {
    const [, tokenBalances] = multicallBalanceResult;

    return tokensByChainId.map((t) => {
      let addr = t.address.toLowerCase();

      if (addr === ZEROEX_NATIVE_TOKEN_ADDRESS) {
        addr = MULTICALL_NATIVE_TOKEN_ADDRESS;
      }

      return {
        token: t,
        balance: tokenBalances[addr],
      };
    }) as TokenBalance[];
  }

  return [];
};

export const getERC20WithProxyUnlockedBalances = async (
  account: string,
  tokens: Token[],
  chainId: ChainId,
  provider: ethers.providers.JsonRpcProvider
) => {
  const tokensByChainId = tokens.filter((t) => Number(t.chainId) === chainId);


  const zrxContracts = getContractAddressesForChainOrThrow(chainId as number);

  const exchangeProxy = zrxContracts.exchangeProxy;
  // Add here native token address
  const tokenAddressesWithNative = [
    MULTICALL_NATIVE_TOKEN_ADDRESS,
    ...tokensByChainId
      .filter((t) => t.address.toLowerCase() !== ZEROEX_NATIVE_TOKEN_ADDRESS)
      .map((t) => t.address.toLowerCase()),
  ];

  const multicallBalanceResult = await getMulticallTokenBalancesAndAllowances(
    tokenAddressesWithNative,
    account,
    exchangeProxy,
    provider
  );

  const balances: TokenBalance[] = [];

  if (multicallBalanceResult) {
    const [, tokenBalances] = multicallBalanceResult;

    const balances = tokensByChainId.map((t) => {
      let addr = t.address.toLowerCase();

      if (addr === ZEROEX_NATIVE_TOKEN_ADDRESS) {
        addr = MULTICALL_NATIVE_TOKEN_ADDRESS;
      }

      return {
        token: t,
        balance: tokenBalances[addr].balance,
        //@dev We are assuming it is unlocked, if it have more than 10*10**18 unlocked
        isProxyUnlocked:
          addr === MULTICALL_NATIVE_TOKEN_ADDRESS
            ? true
            : tokenBalances[addr].allowance.gt(ethers.utils.parseEther('10')),
      };
    }) as TokenBalance[];

    return balances;
  }

  return balances;
};

export const getERC20TokenAllowance = async (
  provider: ethers.providers.BaseProvider,
  tokenAddress: string,
  account: string,
  spender: string
): Promise<ethers.BigNumber> => {
  const contract = new ethers.Contract(tokenAddress, ERC20Abi, provider);

  return await contract.allowance(account, spender);
};


export async function getBalanceOf(networkId: string, address: string, owner: string) {
  const network = NETWORKS[getChainIdFromSlug(networkId)?.chainId as any];
  if (!network) {
    throw new Error('network not supported')
  }
  const iface = new Interface(ERC20Abi);
  const provider = new ethers.providers.JsonRpcProvider(network.providerRpcUrl)
  const contract = new Contract(address, iface, provider);
  return (await contract.balanceOf(owner)) as BigNumber;
}

export async function getKitBalanceOfThreshold(owner: string, amountUnits: string) {
  const networks = Object.keys(DEXKIT);
  let hasKit = 0;
  for (const network of networks) {
    //@ts-ignore
    const balanceOf = await getBalanceOf(network, DEXKIT[network].address, owner);
    //@ts-ignore
    const thresholdUnits = BigNumber.from(amountUnits).mul(BigNumber.from(10).pow(DEXKIT[network].decimals));
    if (balanceOf.gte(thresholdUnits)) {
      hasKit++;
    }
  }
  return hasKit;

}