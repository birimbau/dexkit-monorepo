import { Autocomplete, TextField } from '@mui/material';

export interface ProductTokenAutocompleteProps {
  name: string;
}

export default function ProductTokenAutocomplete({
  name,
}: ProductTokenAutocompleteProps) {
  return (
    <Autocomplete
      options={[]}
      renderInput={(params) => <TextField {...params} size="small" fullWidth />}
    />
  );
}
