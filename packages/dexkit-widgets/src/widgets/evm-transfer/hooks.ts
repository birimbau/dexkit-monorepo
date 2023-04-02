
import { ERC20Abi, ERC721Abi } from '@dexkit/core/constants/abis';
import MultiCall, { CallInput } from '@indexed-finance/multicall';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BigNumber, ethers, providers } from 'ethers';
import { Interface } from 'ethers/lib/utils';
import { CoinTypes } from './enum';
import { getERC20Balance } from './services';
import { Coin, EvmCoin, Nft, NftMetadata } from './types';


export const NFT_QUERY = 'NFT_QUERY';

export function useNft({
  chainId,
  contractAddress,
  tokenId,
  provider,
}: {
  chainId?: number;
  contractAddress?: string;
  tokenId?: string;
  provider?: providers.Web3Provider;
}) {
  return useQuery<Nft>(
    [NFT_QUERY, chainId, contractAddress, tokenId],
    async () => {
      if (!provider || !chainId || !tokenId || !contractAddress) {
        return {} as any;
      }

      const multicall = new MultiCall(provider);
      const iface = new Interface(ERC721Abi);

      const calls: CallInput[] = [];

      calls.push({
        interface: iface,
        target: contractAddress,
        function: 'symbol',
      });
      calls.push({
        interface: iface,
        target: contractAddress,
        args: [tokenId],
        function: 'ownerOf',
      });
      calls.push({
        interface: iface,
        target: contractAddress,
        function: 'name',
      });
      calls.push({
        interface: iface,
        target: contractAddress,
        args: [tokenId],
        function: 'tokenURI',
      });

      const [, results] = await multicall.multiCall(calls);

      return {
        symbol: results[0],
        owner: results[1],
        collectionName: results[2],
        tokenURI: results[3],
        contractAddress,
        tokenId,
      } as Nft;
    },
    { enabled: tokenId !== undefined && contractAddress !== undefined }
  );
}

export const NFT_METADATA_QUERY = 'NFT_METADATA_QUERY';

export function useNftMetadata({ tokenURI }: { tokenURI?: string }) {
  return useQuery(
    [NFT_METADATA_QUERY, tokenURI],
    async () => {
      if (!tokenURI) {
        throw new Error('empty uri');
      }

      return (await axios.get<NftMetadata>(tokenURI)).data;
    },
    { enabled: Boolean(tokenURI) }
  );
}

export function useNftTransfer({
  contractAddress,
  provider,
  onSubmit,
}: {
  contractAddress?: string;
  tokenId?: string;
  provider?: ethers.providers.Web3Provider;
  onSubmit?: (hash: string) => void;
}) {
  return useMutation(
    async ({
      to,
      from,
      tokenId,
    }: {
      to: string;
      from: string;
      tokenId: string;
    }) => {
      if (!contractAddress || !tokenId || !provider) {
        return false;
      }

      const contract = new ethers.Contract(
        contractAddress,
        ERC721Abi,
        provider?.getSigner()
      );

      const tx = await contract.transferFrom(from, to, tokenId);

      if (onSubmit) {
        onSubmit(tx.hash);
      }

      return await tx.wait();
    }
  );
}


export function useEvmTransferMutation({
  provider,
  onSubmit,
}: {
  provider?: ethers.providers.Web3Provider;
  onSubmit?: (
    hash: string,
    params: {
      address: string;
      amount: number;
      coin: Coin;
    }
  ) => void;
}) {
  return useMutation(
    async (params: { coin: EvmCoin; amount: number; address: string }) => {
      const { coin, amount, address } = params;

      if (!provider) {
        return;
      }

      if (coin.coinType === CoinTypes.EVM_ERC20) {
        const contract = new ethers.Contract(
          coin.contractAddress,
          ERC20Abi,
          provider.getSigner()
        );

        const tx = await contract.transfer(
          address,
          ethers.utils.parseUnits(amount.toString(), coin.decimals)
        );

        if (onSubmit) {
          onSubmit(tx.hash, params);
        }

        return await tx.wait();
      }
    }
  );
}

export const ERC20_BALANCE = 'ERC20_BALANCE';

export function useErc20BalanceQuery({
  provider,
  tokenAddress,
  account,
}: {
  tokenAddress?: string;
  account?: string;
  provider?: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider;
}) {
  return useQuery([ERC20_BALANCE, tokenAddress, account], async () => {
    return (
      (await getERC20Balance(tokenAddress, account, provider)) ||
      BigNumber.from(0)
    );
  });
}

const EVM_NATIVE_BALANCE_QUERY = 'EVM_NATIVE_BALANCE_QUERY';

export function useEvmNativeBalance({
  provider,
  account,
}: {
  account?: string;
  provider?: ethers.providers.Web3Provider;
}) {
  return useQuery([EVM_NATIVE_BALANCE_QUERY, account], async () => {
    if (!account || !provider) {
      return BigNumber.from(0);
    }

    return (await provider.getBalance(account)) || BigNumber.from(0);
  });
}