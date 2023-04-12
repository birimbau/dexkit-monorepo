import { useMutation } from "@tanstack/react-query";
import { BigNumber, ethers } from "ethers";
import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";
import { ContractDeployParams } from "../types";

export interface UseContractCallMutationOptions {
  contractAddress?: string;
  abi: ethers.ContractInterface;
  provider?: ethers.providers.Web3Provider;
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
        return;
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

      return result;
    },
    {
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
  onContractCreated: (contract: ethers.Contract) => void;
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

      onContractCreated(result);

      return result;
    },
    {
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
