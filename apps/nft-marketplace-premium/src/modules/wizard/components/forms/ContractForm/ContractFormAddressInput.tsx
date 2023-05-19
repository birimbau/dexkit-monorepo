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

  const [enabled, setEnabled] = useState(false);

  const handleChange = useCallback((value: string) => {
    if (isAddress(value)) {
      setEnabled(true);
      setFieldValue('contractAddress', value);
    }
  }, []);

  const scanContractAbiQuery = useScanContractAbi({
    contractAddress: values.contractAddress,
    onSuccess: (abi: AbiFragment[]) => {
      const fields = inputMapping(abi);

      setFieldValue('fields', fields);
      setFieldValue('abi', abi);

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
