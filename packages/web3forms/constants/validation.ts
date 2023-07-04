import { ethers } from "ethers";
import * as Yup from "yup";

export const EvmSchemaTypes: { [key: string]: Yup.Schema } = {
  uint256: Yup.string().max(32).required(),
  string: Yup.string().required(),
  bytes: Yup.string().required(),
  bool: Yup.bool().required(),
  bytes32: Yup.string()
    .test("bytes32", "invalid bytes32", (value) => {
      return (
        value !== undefined &&
        ethers.utils.isBytesLike(value) &&
        ethers.utils.arrayify(value).length === 32
      );
    })
    .required(),
  "address[]": Yup.array(
    Yup.string().test("address", "invalid address", (value) => {
      return value !== undefined ? ethers.utils.isAddress(value) : true;
    })
  ).required(),
  address: Yup.string()
    .test("address", "invalid address", (value) => {
      return value !== undefined ? ethers.utils.isAddress(value) : true;
    })
    .required(),
};
