import { useMutation } from "@tanstack/react-query";
import { ethers } from "ethers";

export interface UseContractCallMutationOptions {
  contractAddress?: string;
  abi: ethers.ContractInterface;
  provider?: ethers.providers.Web3Provider;
}

export interface UseContractCallMutationParams {
  call?: boolean;
  args: any[];
  name: string;
}

export function useContractCallMutation({
  contractAddress,
  abi,
  provider,
}: UseContractCallMutationOptions) {
  return useMutation(
    async ({ call, name, args }: UseContractCallMutationParams) => {
      let contract: ethers.Contract;

      if (!contractAddress || !provider) {
        return;
      }

      if (call) {
        contract = new ethers.Contract(
          contractAddress,
          abi,
          provider?.getSigner()
        );
      } else {
        contract = new ethers.Contract(contractAddress, abi, provider);
      }

      let cb = contract.functions[name];

      if (args.length > 0) {
      }

      const result = await cb();

      console.log("result", result);

      return result;
    }
  );
}
