import { inputMapping } from '@/modules/wizard/utils';
import { ChainId } from '@dexkit/core';
import LazyTextField from '@dexkit/ui/components/LazyTextField';
import { useScanContractAbi } from '@dexkit/web3forms/hooks';
import { AbiFragment, ContractFormParams } from '@dexkit/web3forms/types';
import { CircularProgress, InputAdornment } from '@mui/material';
import { isAddress } from 'ethers/lib/utils';
import { useFormikContext } from 'formik';
import { useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';

export interface ContractFormAddressInputProps {
  chainId?: ChainId;
}

export default function ContractFormAddressInput({
  chainId,
}: ContractFormAddressInputProps) {
  const { setFieldValue, values } = useFormikContext<ContractFormParams>();

  const [enabled, setEnabled] = useState(isAddress(values.contractAddress));

  const handleChange = useCallback((value: string) => {
    setFieldValue('contractAddress', value);

    if (isAddress(value)) {
      setEnabled(true);
    } else {
      setEnabled(false);
    }
  }, []);

  const scanContractAbiQuery = useScanContractAbi({
    contractAddress: values.contractAddress,
    onSuccess: (abi: AbiFragment[]) => {
      let newAbi = [...abi];

      // this code is to fix abi fragments that come without input name
      for (let i = 0; i < abi.length; i++) {
        const fragment = abi[i];

        for (let j = 0; j < fragment.inputs.length; j++) {
          const input = fragment.inputs[j];

          if (input.name === '') {
            newAbi[i].inputs[j].name = `input${j}`;
          }
        }
      }

      const fields = inputMapping(newAbi);
      setFieldValue('fields', fields);
      setFieldValue('abi', newAbi);

      setEnabled(false);
    },
    chainId,
    enabled,
  });

  return (
    <LazyTextField
      value={values.contractAddress}
      onChange={handleChange}
      TextFieldProps={{
        label: (
          <FormattedMessage
            id="contract.address"
            defaultMessage="Contract address"
          />
        ),
        fullWidth: true,
        InputProps: {
          endAdornment: scanContractAbiQuery.isFetching ? (
            <InputAdornment position="end">
              <CircularProgress color="inherit" size="1rem" />
            </InputAdornment>
          ) : undefined,
        },
      }}
    />
  );
}
