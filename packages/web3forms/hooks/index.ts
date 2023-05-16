import { useMutation, useQuery } from "@tanstack/react-query";
import { BigNumber, ethers } from "ethers";
import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";

import axios from "axios";

import { ChainId } from "@dexkit/core/constants";
import { ETHER_SCAN_API_URL } from "../constants";
import {
  AbiFragment,
  ContractDeployParams,
  ContractFormParams,
} from "../types";

export interface UseContractCallMutationOptions {
  contractAddress?: string;
  abi: ethers.ContractInterface;
  provider?: ethers.providers.Web3Provider;
  onSuccess?: (data: { name: string; result: any }) => void;
}

export interface UseContractCallMutationParams {
  call?: boolean;
  args: any[];
  name: string;
  payable?: boolean;
  value?: BigNumber;
}

export function useContractCallMutation({
  contractAddress,
  abi,
  provider,
  onSuccess,
}: UseContractCallMutationOptions) {
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  return useMutation(
    async ({
      call,
      name,
      args,
      payable,
      value,
    }: UseContractCallMutationParams) => {
      let contract: ethers.Contract;

      if (!contractAddress || !provider) {
        throw new Error("no provider");
      }

      let cb;

      if (call) {
        contract = new ethers.Contract(
          contractAddress,
          abi,
          provider?.getSigner()
        );
      } else {
        contract = new ethers.Contract(contractAddress, abi, provider);
      }

      cb = contract[name];

      let result: any;

      if (args.length > 0) {
        if (payable) {
          result = await cb(...args, { value });
        } else {
          result = await cb(...args);
        }
      } else {
        if (payable) {
          result = await cb({ value });
        } else {
          result = await cb();
        }
      }

      return { name, result };
    },
    {
      onSuccess: onSuccess,
      onError: (err: any) => {
        enqueueSnackbar(
          formatMessage(
            { id: "error.err", defaultMessage: "Error: {err}" },
            { err: String(err.code) }
          ),
          { variant: "error" }
        );
      },
    }
  );
}

export interface UseContractDeployMutationOptions {
  contractBytecode?: string;
  abi: ethers.ContractInterface;
  provider?: ethers.providers.Web3Provider;
  onContractCreated?: (contract: ethers.Contract) => void;
}

export function useContractDeployMutation({
  contractBytecode,
  abi,
  provider,
  onContractCreated,
}: UseContractDeployMutationOptions) {
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  return useMutation(
    async ({
      params,
      value,
    }: {
      params: ContractDeployParams;
      value: BigNumber;
    }) => {
      if (!contractBytecode || !provider) {
        return;
      }

      const { payable, args } = params;

      const factory = new ethers.ContractFactory(
        abi,
        contractBytecode,
        provider.getSigner()
      );

      let result;

      try {
        if (args.length > 0) {
          if (payable) {
            result = await factory.deploy(...args, {
              value,
            });
          } else {
            result = await factory.deploy(...args);
          }
        } else {
          if (payable) {
            result = await factory.deploy({ value });
          } else {
            result = await factory.deploy();
          }
        }

        if (onContractCreated) {
          onContractCreated(result);
        }
      } catch (err: any) {
        enqueueSnackbar(
          formatMessage(
            { id: "error.err", defaultMessage: "Error: {err}" },
            { err: String(err.code) }
          ),
          { variant: "error" }
        );
      }

      return result;
    }
  );
}

export const CALL_ON_MOUNT_QUERY = "CALL_ON_MOUNT_QUERY";

export function useCallOnMountFields({
  contractAddress,
  abi,
  provider,
  params,
  onSuccess,
}: {
  contractAddress: string;
  abi: AbiFragment[];
  provider?: ethers.providers.JsonRpcProvider;
  params: ContractFormParams;
  onSuccess: (results: { [key: string]: any }) => void;
}) {
  return useQuery(
    [CALL_ON_MOUNT_QUERY, params],
    async () => {
      if (provider) {
        let contract = new ethers.Contract(contractAddress, abi, provider);

        let results: { [key: string]: any } = {};

        for (let field of Object.keys(params.fields)) {
          if (params.fields[field].callOnMount) {
            const cb = contract[field];
            const args = Object.keys(params.fields[field].input).map(
              (key) => params.fields[field].input[key].defaultValue
            );

            let result = await cb(...args);

            results[field] = result;
          }
        }

        return results;
      }

      return {};
    },
    {
      onSuccess,
    }
  );
}

// https://api.etherscan.io/api?module=contract&action=getabi&address=0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359

export const SCAN_CONTRACT_ABI = "SCAN_CONTRACT_ABI";

export function useScanContractAbi({
  contractAddress,
  onSuccess,
  chainId,
  enabled,
}: {
  contractAddress: string;
  onSuccess: (abi: AbiFragment[]) => void;
  chainId?: ChainId;
  enabled?: boolean;
}) {
  return useQuery(
    [SCAN_CONTRACT_ABI, contractAddress],
    async ({ signal }) => {
      if (!ethers.utils.isAddress(contractAddress)) {
        throw new Error("invalid contract address");
      }

      if (!chainId) {
        throw new Error("no chain id");
      }

      const resp = await axios.get(
        `https://api.${ETHER_SCAN_API_URL[chainId] ?? ""}/api`,
        {
          params: {
            action: "getabi",
            module: "contract",
            address: contractAddress,
          },
          signal,
        }
      );

      return JSON.parse(resp.data.result);
    },
    {
      onSuccess,
      enabled,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
}
