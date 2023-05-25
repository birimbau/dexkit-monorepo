import { EvmSchemaTypes } from "../constants/validation";

import * as Yup from "yup";
import { FunctionInput } from "../types";

export function getSchemaForInput(type: string) {
  return EvmSchemaTypes[type];
}

export function getSchemaForInputs(inputs: FunctionInput[]) {
  let obj: { [key: string]: Yup.Schema } = {};

  for (let input of inputs) {
    obj[input.name] = getSchemaForInput(input.type);
  }

  return Yup.object(obj);
}
