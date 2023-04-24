import { ethers } from 'ethers';
import * as Yup from 'yup';

export const ContractFormSchema = Yup.object().shape({
  chainId: Yup.number(),
  abi: Yup.array(),
  contractAddress: Yup.string()
    .test('address', (value, context) => {
      return value !== undefined ? ethers.utils.isAddress(value) : true;
    })
    .required(),
  fields: Yup.object({}),
});
