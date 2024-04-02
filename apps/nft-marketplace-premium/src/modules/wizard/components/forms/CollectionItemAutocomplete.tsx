import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useEffect, useMemo, useState } from 'react';

import { getChainName, getChainSymbol } from '@dexkit/core/utils/blockchain';
import { useAppWizardConfig } from '../../hooks';

type Data = {
  image: string;
  name: string;
  backgroundImage: string;
  network: string;
  chainId: number;
  contractAddress: string;
  description?: string;
  uri?: string;
};

interface Props {
  formValue: {
    chainId?: number;
    contractAddress?: string;
    backgroundImageUrl?: string;
  };
  filterByChainId?: boolean;
  chainId?: number;
  onChange: (formValue: any) => void;
  disabled?: boolean;
}

export function CollectionItemAutocomplete(props: Props) {
  const { formValue, onChange, filterByChainId, chainId, disabled } = props;
  const { wizardConfig } = useAppWizardConfig();
  const [collectionValue, setCollectionValue] = useState<Data | undefined>();

  const collections =
    filterByChainId && chainId
      ? wizardConfig.collections
          ?.filter((c) => c.chainId === chainId)
          .map((value) => {
            return {
              name: value.name,
              contractAddress: value.contractAddress,
              backgroundImage: value.backgroundImage,
              network: getChainName(value.chainId) as string,
              chainId: value.chainId,
              image: value.image,
            };
          }) || []
      : wizardConfig.collections?.map((value) => {
          return {
            name: value.name,
            contractAddress: value.contractAddress,
            backgroundImage: value.backgroundImage,
            network: getChainName(value.chainId) as string,
            chainId: value.chainId,
            image: value.image,
          };
        }) || [];

  useEffect(() => {
    if (
      formValue &&
      collections &&
      formValue.chainId !== collectionValue?.chainId &&
      formValue.contractAddress?.toLowerCase() !==
        collectionValue?.contractAddress.toLowerCase()
    ) {
      const coll = collections.find(
        (c) =>
          Number(c.chainId) === Number(formValue.chainId) &&
          c.contractAddress?.toLowerCase() ===
            formValue.contractAddress?.toLowerCase(),
      );
      if (coll) {
        setCollectionValue({ ...coll });
      }
    }
  }, [formValue, collections, collectionValue]);

  const dataValue = useMemo(() => {
    return { ...collectionValue };
  }, [collectionValue]);

  return (
    <Autocomplete
      id="item-collection"
      sx={{ width: 300 }}
      value={dataValue || null}
      defaultValue={dataValue || null}
      options={collections}
      autoHighlight
      isOptionEqualToValue={(op, val) =>
        op?.chainId === val?.chainId &&
        op?.contractAddress?.toLowerCase() ===
          val?.contractAddress?.toLowerCase()
      }
      disabled={disabled}
      onChange={(_change, value) => {
        if (value) {
          onChange({
            name: value.name,
            contractAddress: value.contractAddress,
            backgroundImage: value.backgroundImage,
            network: value.network,
            chainId: value.chainId,
            image: value.image,
          });
        }
      }}
      getOptionLabel={(option) =>
        option.name ? `${getChainSymbol(option.chainId)}-${option.name}` : ''
      }
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
          {...props}
        >
          <img loading="lazy" width="20" src={`${option.image}`} alt="" />
          {getChainName(option.chainId)} - {option.name}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Choose a collection"
          inputProps={{
            ...params.inputProps,
            autoComplete: 'off', // disable autocomplete and autofill
          }}
        />
      )}
    />
  );
}
