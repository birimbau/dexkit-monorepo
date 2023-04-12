import { ChainId } from "@dexkit/core/constants";

export type FunctionInput = {
  type: string;
  name: string;
};

export interface CallParams {
  name: string;
  args: any[];
  call: boolean;
  payable?: boolean;
}

export interface ContractDeployParams {
  args: any[];
  payable?: boolean;
}

export interface AbiFragment {
  type: "function" | "constructor";
  name?: string;
  inputs: { type: string; name: string; internalType?: string }[];
  outputs: {}[];
  stateMutability: string;
}

export type ContractFormParams = {
  contractAddress: string;
  chainId: ChainId;
  fields: {
    [key: string]: {
      visible: boolean;
      readOnly: boolean;
      callOnMount: boolean;
      input: { [key: string]: string };
    };
  };
  abi: AbiFragment[];
};
