import { getContractImplementation } from '@/modules/wizard/services';
import { inputMapping } from '@/modules/wizard/utils';
import { ChainId } from '@dexkit/core';
import { NETWORKS } from '@dexkit/core/constants/networks';
import LazyTextField from '@dexkit/ui/components/LazyTextField';
import { useScanContractAbiMutation } from '@dexkit/web3forms/hooks';
import { AbiFragment, ContractFormParams } from '@dexkit/web3forms/types';
import RefreshIcon from '@mui/icons-material/Refresh';
import { CircularProgress, IconButton, InputAdornment } from '@mui/material';
import { ethers } from 'ethers';
import { isAddress } from 'ethers/lib/utils';
import { useFormikContext } from 'formik';
import { useSnackbar } from 'notistack';
import { useCallback, useMemo } from 'react';
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

  const jsonProvider = useMemo(() => {
    if (chainId) {
      return new ethers.providers.JsonRpcProvider(
        NETWORKS[chainId].providerRpcUrl
      );
    }
  }, [chainId]);

  const fetchAbi = useCallback(
    async (value: string) => {
      if (isAddress(value)) {
        try {
          let address: string = value;

          if (!values.disableProxy && jsonProvider) {
            let implementationAddress: string = '';

            try {
              implementationAddress = await getContractImplementation({
                contractAddress: value,
                provider: jsonProvider,
              });
            } catch (err) {}

            if (isAddress(implementationAddress)) {
              address = implementationAddress;
            }
          }

          let abi = await scanContractAbiMutation.mutateAsync({
            chainId: values.chainId,
            contractAddress: address,
          });

          let newAbi: AbiFragment[] = [...abi];

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
    },
    [values.chainId, values.disableProxy, jsonProvider]
  );

  const handleChange = useCallback(
    async (value: string) => {
      await fetchAbi(value);
      setFieldValue('contractAddress', value);
    },
    [fetchAbi]
  );

  const handleRefresh = async () => {
    await fetchAbi(values.contractAddress);
  };

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
          ) : (
            <IconButton
              disabled={values.contractAddress === ''}
              size="small"
              color="primary"
              onClick={handleRefresh}
            >
              <RefreshIcon />
            </IconButton>
          ),
        },
      }}
    />
  );
}
