import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { getChainName } from 'src/utils/blockchain';
import { useAppWizardConfig } from '../../hooks';

type Data = {
  image: string;
  name: string;
  backgroundImage: string;
  network?: string;
  contractAddress: string;
  description?: string;
  uri?: string;
};

interface Props {
  formValue: {
    chainId: number;
    contractAddress: string;
    backgroundImageUrl?: string;
  };
  onChange: (formValue: any) => void;
}

export function CollectionItemAutocomplete(props: Props) {
  const { formValue, onChange } = props;
  const { wizardConfig } = useAppWizardConfig();
  const [collectionValue, setCollectionValue] = useState<Data | undefined>();

  const collections =
    wizardConfig.collections?.map((value) => {
      return {
        name: value.name,
        contractAddress: value.contractAddress,
        backgroundImage: value.backgroundImage,
        network: getChainName(value.chainId),
        chainId: value.chainId,
        image: value.image,
      };
    }) || [];

  useEffect(() => {
    if (formValue && collections) {
      const coll = collections.find(
        (c) =>
          c.chainId === formValue.chainId &&
          c.contractAddress === formValue.contractAddress
      );
      if (coll) {
        setCollectionValue(coll);
      }
    }
  }, [formValue, collections]);

  return (
    <Autocomplete
      id="item-collection"
      sx={{ width: 300 }}
      inputValue={collectionValue?.name ? collectionValue.name : ''}
      options={collections}
      autoHighlight
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
      getOptionLabel={(option) => option.name}
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
            autoComplete: 'new-password', // disable autocomplete and autofill
          }}
        />
      )}
    />
  );
}
