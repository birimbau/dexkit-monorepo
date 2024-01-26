import { useNetworkMetadata } from '@dexkit/ui/hooks/app';
import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { connectField } from 'uniforms';
import { useAppWizardConfig } from '../../../hooks';

export type CollectionUniformItem = {
  name: string;
  contractAddress: string;
  backgroundImage: string;
  network: string;
  chainId: number;
  image: string;
};

export const CollectionAutcompleteUniform = connectField<{
  value: CollectionUniformItem[];
  label: string;
  onChange: (v: CollectionUniformItem[] | void) => void;
}>((props) => {
  const { value, onChange } = props;
  const { wizardConfig } = useAppWizardConfig();

  const { NETWORK_NAME } = useNetworkMetadata();

  const collections =
    wizardConfig.collections
      ?.map((val) => {
        return {
          name: val.name,
          contractAddress: val.contractAddress,
          backgroundImage: val.backgroundImage,
          network: NETWORK_NAME(val.chainId) || '',
          chainId: val.chainId,
          image: val.image,
        };
      })
      .filter(
        (v) =>
          !value
            .map((val) => val.contractAddress)
            .includes(v.contractAddress) &&
          !value.map((val) => val.chainId).includes(v.chainId),
      ) || [];

  return (
    <FormControl fullWidth>
      <Autocomplete
        id="collection"
        sx={{ pt: 1 }}
        multiple={true}
        defaultValue={value ? value : []}
        options={collections}
        getOptionLabel={(op) => `${op.name} - ${NETWORK_NAME(op.chainId)}`}
        autoHighlight
        onChange={(_change, val) => {
          if (val) {
            onChange(val);
          } else {
            onChange([]);
          }
        }}
        renderTags={(val: readonly any[], getTagProps) =>
          val.map((option: any, index: number) => (
            <Chip
              variant="outlined"
              avatar={<Avatar alt={option} src={option.image} />}
              label={` ${option.name} - ${NETWORK_NAME(option.chainId)}`}
              {...getTagProps({ index })}
              key={index}
            />
          ))
        }
        renderOption={(props, option, state) => (
          <Box
            component="li"
            sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
            {...props}
          >
            <img loading="lazy" width="20" src={`${option.image}`} alt="" />
            {option.name} - {NETWORK_NAME(option.chainId)}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search only these collections"
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password', // disable autocomplete and autofill
            }}
          />
        )}
      />
    </FormControl>
  );
});
