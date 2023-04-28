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

export type AbiFragmentInput = {
  type: string;
  name: string;
  internalType?: string;
};

export interface AbiFragment {
  type: "function" | "constructor";
  name: string;
  inputs: AbiFragmentInput[];
  outputs: {}[];
  stateMutability: string;
}

export interface ContractFormFieldInputBase {
  label: string;
  defaultValue: string;
}

export interface ContractFormFieldSwitch {
  inputType: "switch";
  label: string;
  defaultValue: string;
}

export interface ContractFormFieldNormal {
  inputType: "normal";
  label: string;
  defaultValue: string;
}

export interface ContractFormFieldInputAddress {
  inputType: "address";
  addresses: string[];
  label: string;
  defaultValue: string;
}

export type ContractFormFieldInput =
  | ContractFormFieldNormal
  | ContractFormFieldSwitch
  | ContractFormFieldInputAddress;

export type ContractFormField = {
  name: string;
  visible: boolean;
  lockInputs: boolean;
  hideInputs: boolean;
  callOnMount: boolean;
  collapse: boolean;
  hideLabel: boolean;
  callToAction: string;
  input: {
    [key: string]: ContractFormFieldInput;
  };
};

export type ContractFormParams = {
  contractAddress: string;
  chainId: ChainId;
  fields: {
    [key: string]: ContractFormField;
  };
  abi: AbiFragment[];
};
