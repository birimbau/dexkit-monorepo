import { ThemeMode } from "@dexkit/ui/constants/enum";
import {
  AbiFragment,
  ContractFormField,
  ContractFormFieldInputWithTupleParams,
} from "@dexkit/web3forms/types";
import {
  createTheme,
  experimental_extendTheme as extendTheme,
} from "@mui/material/styles";
import get from "lodash/get";
import set from "lodash/set";
import { getTheme } from "src/theme";
import { Token } from "../../../types/blockchain";

import { AppCollection } from "@dexkit/ui/modules/wizard/types/config";
import { FeeForm } from "../components/sections/FeesSectionForm";
import { MAX_FEES } from "../constants";
import { CustomThemeColorSchemesInterface } from "../state";

import { ContractFormField } from "@dexkit/web3forms/types/index";

export function inputMapping(abi: AbiFragment[]) {
  let fields: {
    [key: string]: ContractFormField;
  } = {};

  for (let item of abi) {
    if (item.name) {
      let inputs: {
        [key: string]: ContractFormFieldInputWithTupleParams;
      } = {};
      for (let inp of item.inputs) {
        inputs[inp.name] = {
          defaultValue: "",
          label: inp.name,
          inputType: "normal",
        };
      }

      fields[item.name] = {
        name: item.name,
        input: inputs,
        description: "",
        callOnMount: false,
        lockInputs: false,
        visible: false,
        collapse: false,
        hideInputs: false,
        hideLabel: false,
        output: { type: "" },
        callToAction: "",
      };
    }
  }

  return fields;
}

export function requiredField(message: string) {
  return (value: string) => {
    return !value ? message : undefined;
  };
}

export function mapObject(
  obj: any,
  other: any,
  keys: { [key: string]: string }
) {
  for (const key of Object.keys(keys)) {
    set(obj, key, get(other, keys[key]));
  }
}
/**
 * If value is undefined it not maps the value
 * @param obj
 * @param other
 * @param keys
 */
export function mapNotNullObject(
  obj: any,
  other: any,
  keys: { [key: string]: string }
) {
  for (const key of Object.keys(keys)) {
    if (get(other, keys[key])) {
      set(obj, key, get(other, keys[key]));
    }
  }
}
