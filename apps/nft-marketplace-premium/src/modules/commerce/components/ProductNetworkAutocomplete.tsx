import { Autocomplete, TextField } from '@mui/material';

export interface ProductNetworkAutocompleteProps {
  name: string;
}

export default function ProductNetworkAutocomplete({
  name,
}: ProductNetworkAutocompleteProps) {
  return (
    <Autocomplete
      options={[]}
      renderInput={(params) => <TextField {...params} size="small" fullWidth />}
    />
  );
}
