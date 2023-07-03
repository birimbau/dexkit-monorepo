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

export type FragmentOutput = {
  internalType?: string;
  name?: string;
  type?: string;
};

export interface AbiFragment {
  type: string;
  name: string;
  inputs: AbiFragmentInput[];
  outputs: FragmentOutput[];
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

export interface ContractFormFieldInputDecimal {
  inputType: "decimal";
  decimals: number;
  label: string;
  defaultValue: string;
}

export interface ContractFormFieldInputConnectedAccount {
  inputType: "connectedAccount";
  label: string;
  defaultValue: string;
}

export type ContractFormFieldInput =
  | ContractFormFieldNormal
  | ContractFormFieldSwitch
  | ContractFormFieldInputAddress
  | ContractFormFieldInputDecimal
  | ContractFormFieldInputConnectedAccount;

export type NoOutputType = {
  type: "";
};

export type DecimalOutputType = {
  type: "decimal";
  decimals: number;
};

export type OutputType = NoOutputType | DecimalOutputType;

export type ContractFormField = {
  name: string;
  description?: string;
  visible: boolean;
  lockInputs: boolean;
  hideInputs: boolean;
  callOnMount: boolean;
  collapse: boolean;
  hideLabel: boolean;
  callToAction: string;
  output?: OutputType;
  input: {
    [key: string]: ContractFormFieldInput;
  };
};

export type ContractFormParams = {
  contractAddress: string;
  disableProxy?: boolean;
  chainId: ChainId;
  fields: {
    [key: string]: ContractFormField;
  };
  abi: AbiFragment[];
};

export type ThirdWebDeployFormInputBase = {
  inputType: string;
  label?: string;
  locked?: boolean;
  helpText?: string;
};

export type ThirdWebDeployFormInputIpfs = ThirdWebDeployFormInputBase & {
  inputType: "json";
  ipfsUrl: string;
};

export type ThirdWebDeployFormInput = ThirdWebDeployFormInputIpfs;

export type ThirdWebDeployFormParams = {
  inputs: { [key: string]: ThirdWebDeployFormInput };
};

export type AddressInput = {
  type: "address";
  subtype?: "connected-address" | "string";
};

export type CheckboxInput = {
  type: "checkbox";
};

export type ImageInput = {
  type: "image";
};

export type HiddenInput = {
  type: "hidden";
  subtype?: "connected-address" | "string";
};

export type AddressArrayInput = {
  type: "address-array";
};

export type DecimalInput = {
  type: "decimal";
  decimals: number;
};

export type InputComponent =
  | AddressInput
  | CheckboxInput
  | ImageInput
  | HiddenInput
  | AddressArrayInput
  | DecimalInput;

export type FormInput = {
  type: "input";
  ref: string;
  locked: boolean;
  label: string;
  defaultValue?: any;
  component?: InputComponent;
  helperText?: string;
  col?: {
    sm?: number;
    xs?: number;
  };
};

export type FormInputGroup = {
  type: "input-group";
  inputs: FormInput[];
  col?: {
    sm?: number;
    xs?: number;
  };
};

export type FormElement = FormInput | FormInputGroup;

export type Form = {
  elements: FormElement[];
};

export type ObjectMapping = {
  name: string;
  type?: string;
  fields: {
    type?: string;
    name: string;
    fields?: string[];
  }[];
};

export type FormOutputFormat = {
  objects: ObjectMapping[];
};

export type FormConfigParams = {
  paramsOrder: string[];
  output: ObjectMapping[];
  form: FormElement[];
  name: string;
  description: string;
};

export type ThirdwebContract = {
  factory: string;
  implementation: string;
};

export type ThirdwebMetadata = {
  name: string;
  metadataUri: string;
  bytecodeUri: string;
  analytics: {
    command: string;
    contract_name: string;
    cli_version: string;
    project_type: string;
    from_ci: boolean;
    uses_contract_extensions: boolean;
  };
  version: string;
  displayName: string;
  description: string;
  readme: string;
  changelog: string;
  audit: string;
  logo: string;
  isDeployableViaFactory: boolean;
  isDeployableViaProxy: boolean;
  factoryDeploymentData: {
    implementationAddresses: { [key: string]: string };
    implementationInitializerFunction: string;
    factoryAddresses: { [key: string]: string };
  };
  constructorParams: { [key: string]: any };
  publisher: string;
};
