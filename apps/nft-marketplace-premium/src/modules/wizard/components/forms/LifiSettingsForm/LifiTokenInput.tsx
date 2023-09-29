import { TOKEN_ICON_URL } from '@dexkit/core';
import { Token } from '@dexkit/core/types';
import { isAddressEqual } from '@dexkit/core/utils';
import TokenIcon from '@mui/icons-material/Token';
import {
  Autocomplete,
  Avatar,
  InputAdornment,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
} from '@mui/material';
import { useField } from 'formik';
import React from 'react';

export interface LifiTokenInputProps {
  name: string;
  tokens: Token[];
  label: React.ReactNode;
}

export default function LifiTokenInput({
  name,
  tokens,
  label,
}: LifiTokenInputProps) {
  const [field, meta, helpers] = useField(name);

  const handleChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: Token | null,
  ) => {
    if (value) {
      helpers.setValue(value);
    } else {
      helpers.setValue(undefined);
    }
  };

  return (
    <Autocomplete
      options={tokens}
      isOptionEqualToValue={(opt, value) =>
        opt.chainId === value.chainId &&
        isAddressEqual(opt.contractAddress, value.contractAddress)
      }
      onChange={handleChange}
      getOptionLabel={(opt) => opt.symbol.toUpperCase()}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          InputProps={{
            ...params.InputProps,
            startAdornment: field.value ? (
              <InputAdornment position="end">
                <Avatar
                  sx={{ width: '1rem', height: '1rem' }}
                  src={
                    field.value.logoURI
                      ? field.value.logoURI
                      : field.value
                      ? TOKEN_ICON_URL(
                          field.value.contractAddress,
                          field.value.chainId,
                        )
                      : undefined
                  }
                />
              </InputAdornment>
            ) : undefined,
          }}
          error={Boolean(meta.error)}
          helperText={meta.error}
        />
      )}
      renderOption={(props, opt) => (
        <ListItem {...props}>
          <ListItemAvatar>
            <Avatar
              src={
                opt.logoURI
                  ? opt.logoURI
                  : TOKEN_ICON_URL(opt.contractAddress, opt.chainId)
              }
            >
              <TokenIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={opt.symbol.toUpperCase()}
            secondary={opt.name}
          />
        </ListItem>
      )}
    />
  );
}
