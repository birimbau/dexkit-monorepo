import {
  UseMutationOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { BigNumber, ethers } from "ethers";
import { ERC20Abi } from "../constants/abis";
import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "../constants/zrx";
import { getERC20TokenAllowance } from "../services";
import { getERC20Balance } from "../services/balances";
import { isAddressEqual } from "../utils";

export const ERC20_BALANCE = "ERC20_BALANCE";

export interface Erc20BalanceParams {
  account?: string;
  contractAddress?: string;
  provider?: ethers.providers.BaseProvider;
}

export function useErc20BalanceQuery({
  account,
  contractAddress,
  provider,
}: Erc20BalanceParams) {
  return useQuery([ERC20_BALANCE, account, contractAddress], async () => {
    if (!contractAddress || !provider || !account) {
      return BigNumber.from(0);
    }

    if (isAddressEqual(contractAddress, ZEROEX_NATIVE_TOKEN_ADDRESS)) {
      return await provider.getBalance(account);
    }

    const contract = new ethers.Contract(contractAddress, ERC20Abi, provider);

    return (await contract.balanceOf(account)) as BigNumber;
  });
}

const EVM_NATIVE_BALANCE_QUERY = "EVM_NATIVE_BALANCE_QUERY";

export function useEvmNativeBalanceQuery({
  provider,
  account,
}: {
  account?: string;
  provider?: ethers.providers.BaseProvider;
}) {
  return useQuery([EVM_NATIVE_BALANCE_QUERY, account], async () => {
    if (!account || !provider) {
      return BigNumber.from(0);
    }

    return (await provider.getBalance(account)) || BigNumber.from(0);
  });
}

export const GET_ERC20_BALANCE = "GET_ERC20_BALANCE";

export function useErc20Balance(
  provider?: ethers.providers.BaseProvider,
  contractAddress?: string,
  account?: string
) {
  return useQuery<ethers.BigNumber | undefined>(
    [GET_ERC20_BALANCE, contractAddress, account],
    async () => {
      if (!contractAddress || !account || !provider) {
        return undefined;
      }

      return getERC20Balance(contractAddress, account, provider);
    },
    {
      enabled: contractAddress !== undefined && account !== undefined,
    }
  );
}

export const TOKEN_ALLOWANCE_QUERY = "TOKEN_ALLOWANCE_QUERY";

export function useTokenAllowanceQuery({
  tokenAddress,
  account,
  spender,
  provider,
}: {
  account?: string;
  tokenAddress?: string;
  spender?: string;
  provider?: ethers.providers.Web3Provider;
}) {
  return useQuery(
    [TOKEN_ALLOWANCE_QUERY, tokenAddress, account, spender],
    async () => {
      if (!provider || !tokenAddress || !account || !spender) {
        return ethers.BigNumber.from(0);
      }

      return await getERC20TokenAllowance(
        provider,
        tokenAddress,
        account,
        spender
      );
    }
  );
}

export function useApproveToken({
  spender,
  tokenContract,
  provider,
  options,
  onSubmited,
}: {
  spender?: string;
  tokenContract?: string;
  provider?: ethers.providers.Web3Provider;
  onSubmited: (hash: string) => void;
  options?: Omit<
    UseMutationOptions<
      ethers.ContractReceipt | undefined,
      unknown,
      void,
      unknown
    >,
    "mutationFn"
  >;
}) {
  return useMutation(async () => {
    if (!tokenContract || !spender) {
      return;
    }

    // const tx = await approveToken(
    //   tokenContract,
    //   spender,
    //   BigNumber.from("1000000").mul(BigNumber.from("10").pow(18)),
    //   provider
    // );

    // onSubmited(tx.hash);

    // return await tx.wait();
    return undefined;
  }, options);
}
