import { ethers } from "ethers";
import * as Yup from "yup";

export const EvmSchemaTypes: { [key: string]: Yup.Schema } = {
  uint256: Yup.string().max(32).required(),
  string: Yup.string().required(),
  bytes: Yup.string().required(),
  bool: Yup.string().oneOf(["0", "1"]).required(),
  address: Yup.string()
    .test("address", (value) => {
      return value !== undefined ? ethers.utils.isAddress(value) : true;
    })
    .required(),
};
