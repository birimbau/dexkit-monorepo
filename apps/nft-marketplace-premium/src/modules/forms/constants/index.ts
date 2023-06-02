import { isHexString } from 'ethers/lib/utils';
import * as Yup from 'yup';

export const CreateTemplateSchema = Yup.object().shape({
  name: Yup.string().required(),
  description: Yup.string().required(),
  abi: Yup.string().required(),
  bytecode: Yup.string()
    .test('bytecode', (value) => {
      return isHexString(`0x${value}`);
    })
    .required(),
});
