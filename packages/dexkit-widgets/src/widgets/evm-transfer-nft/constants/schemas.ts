import { ChainId } from '@dexkit/core/constants';
import { NETWORK_PROVIDER } from '@dexkit/core/constants/networks';
import { ethers } from 'ethers';
import * as Yup from 'yup';


export const TransferNftSchema = Yup.object().shape({
  address: Yup.string()
    .test('address', async function (value) {

      if (value && value.split('.').length > 1) {
        const provider = NETWORK_PROVIDER(ChainId.Ethereum);
        const resolveName = await provider?.resolveName(value);
        if (resolveName) {
          return true
        } else {
          return false;
        }
      }
      return value !== undefined ? ethers.utils.isAddress(value) : true;
    })
    .required(),
});
