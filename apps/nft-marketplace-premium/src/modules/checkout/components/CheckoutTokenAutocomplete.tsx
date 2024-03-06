import { Token } from '@dexkit/core/types';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import React from 'react';
import { FormattedMessage } from 'react-intl';

export interface CheckoutTokenAutocompleteProps {
  label?: string | React.ReactNode;
  chainId?: number;
  data?: any;
  disabled?: boolean;
  onChange?: (token: Token | null) => void;
  tokens: Token[];
  token: Token | null;
}

export default function CheckoutTokenAutocomplete(
  props: CheckoutTokenAutocompleteProps,
) {
  const { data, label, onChange, chainId, disabled, tokens, token } = props;

  return (
    <Autocomplete
      disabled={disabled}
      options={tokens}
      autoHighlight
      value={token}
      isOptionEqualToValue={(op, val) =>
        op?.chainId === val?.chainId &&
        op?.address?.toLowerCase() === val?.address?.toLowerCase()
      }
      filterOptions={(x) => x}
      onChange={(event, value) => {
        if (onChange) {
          onChange(value);
        }
      }}
      getOptionLabel={(option) => {
        return option.name
          ? `${option.name} ${option.symbol.toUpperCase()}`
          : '';
      }}
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
          {...props}
        >
          <img loading="lazy" width="20" src={`${option.logoURI}`} alt="" />
          {option.name} {option?.symbol.toUpperCase() || ''}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={<FormattedMessage id="token" defaultMessage="Token" />}
          inputProps={{
            ...params.inputProps,
            autoComplete: 'off', // disable autocomplete and autofill
          }}
        />
      )}
    />
  );
}
