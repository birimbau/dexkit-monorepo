import { TOKEN_ICON_URL } from '@dexkit/core';
import { Token } from '@dexkit/core/types';
import TokenIcon from '@mui/icons-material/Token';
import {
  Autocomplete,
  Avatar,
  Chip,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  TextField,
} from '@mui/material';
import React from 'react';

import { isAddressEqual } from '@dexkit/core/utils';
import { useField } from 'formik';

export interface LifiMultiTokenInputProps {
  label?: React.ReactNode;
  tokens: Token[];
  name: string;
}

export default function LifiMultiTokenInput({
  label,
  tokens,
  name,
}: LifiMultiTokenInputProps) {
  const [field, meta, helpers] = useField<Token[] | undefined>(name);

  const handleChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: Token[] | undefined,
  ) => {
    if (value) {
      helpers.setValue(value);
    } else {
      helpers.setValue(undefined);
    }
  };

  return (
    <Autocomplete
      disablePortal
      value={field.value}
      options={tokens}
      fullWidth
      onChange={handleChange}
      multiple
      isOptionEqualToValue={(opt, value) =>
        opt.chainId === value.chainId &&
        isAddressEqual(opt.contractAddress, value.contractAddress)
      }
      renderOption={(props, opt) => (
        <MenuItem {...props}>
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
        </MenuItem>
      )}
      renderTags={(value: readonly Token[], getTagProps) =>
        value.map((option: Token, index: number) => (
          <Chip
            icon={
              <Avatar
                sx={{ height: '1rem', width: '1rem' }}
                src={
                  option.logoURI
                    ? option.logoURI
                    : TOKEN_ICON_URL(option.contractAddress, option.chainId)
                }
              >
                <TokenIcon />
              </Avatar>
            }
            variant="outlined"
            label={option.symbol.toUpperCase()}
            {...getTagProps({ index })}
          />
        ))
      }
      getOptionLabel={(opt) => opt.symbol.toUpperCase()}
      renderInput={(params) => {
        return (
          <TextField
            key={params.inputProps.value?.toString()}
            {...params}
            label={label}
          />
        );
      }}
    />
  );
}
