import { inputMapping } from '@/modules/wizard/utils';
import { ChainId } from '@dexkit/core';
import LazyTextField from '@dexkit/ui/components/LazyTextField';
import { useScanContractAbiMutation } from '@dexkit/web3forms/hooks';
import { AbiFragment, ContractFormParams } from '@dexkit/web3forms/types';
import { CircularProgress, InputAdornment } from '@mui/material';
import { isAddress } from 'ethers/lib/utils';
import { useFormikContext } from 'formik';
import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

export interface ContractFormAddressInputProps {
  chainId?: ChainId;
}

export default function ContractFormAddressInput({
  chainId,
}: ContractFormAddressInputProps) {
  const { setFieldValue, values } = useFormikContext<ContractFormParams>();

  const scanContractAbiMutation = useScanContractAbiMutation();

  const { enqueueSnackbar } = useSnackbar();

  const handleChange = useCallback(
    async (value: string) => {
      if (isAddress(value)) {
        try {
          let abi = await scanContractAbiMutation.mutateAsync({
            chainId: values.chainId,
            contractAddress: value,
          });

          let newAbi: AbiFragment[] = [...abi];

          console.log(newAbi);

          // this code is to fix abi fragments that come without input name
          for (let i = 0; i < newAbi.length; i++) {
            const fragment = newAbi[i];

            if (
              fragment.type === 'function' ||
              fragment.type === 'constructor'
            ) {
              for (let j = 0; j < fragment.inputs?.length; j++) {
                const input = fragment.inputs[j];

                if (input.name === '') {
                  newAbi[i].inputs[j].name = `input${j}`;
                }
              }
            }
          }

          const fields = inputMapping(newAbi);
          setFieldValue('fields', fields);
          setFieldValue('abi', newAbi);
        } catch (err) {
          enqueueSnackbar(String(err), { variant: 'error' });
        }
      }

      setFieldValue('contractAddress', value);
    },
    [values.chainId]
  );

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
          endAdornment: scanContractAbiMutation.isLoading ? (
            <InputAdornment position="end">
              <CircularProgress color="inherit" size="1rem" />
            </InputAdornment>
          ) : undefined,
        },
      }}
    />
  );
}
