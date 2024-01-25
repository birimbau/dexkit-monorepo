import { NETWORKS } from '@dexkit/core/constants/networks';
import { Stack } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import React, { useMemo, useState } from 'react';
import { Token } from 'src/types/blockchain';
import { getChainName, getChainSymbol } from 'src/utils/blockchain';

interface Props {
  label?: string | React.ReactNode;
  chainId?: number;
  data?: any;
  disabled?: boolean;
  onChange?: any;
  tokens?: Token[];
}

export function SearchTokenAutocomplete(props: Props) {
  const { data, label, onChange, chainId, disabled, tokens } = props;

  const [search, setSearch] = useState<string>();

  const formValue = useMemo(() => {
    return { ...data };
  }, [data]);

  const assets = useMemo(() => {
    if (search) {
      return (
        tokens
          ?.filter((tk) => {
            if (chainId) {
              return tk.chainId === chainId;
            } else {
              return true;
            }
          })
          ?.filter(
            (v) =>
              v.name.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
              v.symbol.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
              v.address.toLowerCase().indexOf(search.toLowerCase()) !== -1,
          )
          ?.map((value) => {
            return {
              name: (value.name as string) || '',
              address: value.address.toLowerCase(),
              symbol: value.symbol,
              network: Object.values(NETWORKS).find(
                (n) => n.chainId === value?.chainId,
              )?.name,
              chainId: value.chainId as number,
              logoURI: value?.logoURI,
              decimals: value.decimals,
            };
          }) || []
      );
    }

    return (
      tokens
        ?.filter((tk) => {
          if (chainId) {
            return tk.chainId === chainId;
          } else {
            return true;
          }
        })
        .map((value) => {
          return {
            name: (value.name as string) || '',
            address: value.address.toLowerCase(),
            symbol: value.symbol,
            network: Object.values(NETWORKS).find(
              (n) => n.chainId === value?.chainId,
            )?.name,
            chainId: value.chainId as number,
            logoURI: value?.logoURI,
            decimals: value.decimals,
          };
        }) || []
    );
  }, [formValue, chainId, tokens, search]);

  return (
    <Autocomplete
      id="search-token"
      disabled={disabled}
      defaultValue={formValue || null}
      value={formValue || null}
      options={assets}
      autoHighlight
      isOptionEqualToValue={(op, val) =>
        op?.chainId === val?.chainId &&
        op?.address?.toLowerCase() === val?.address?.toLowerCase()
      }
      filterOptions={(x) => x}
      onChange={(_change, value) => {
        if (
          value &&
          onChange &&
          (chainId !== undefined ? value.chainId === chainId : true)
        ) {
          onChange({
            name: value.name,
            address: value.address,
            network: value.network,
            chainId: value.chainId,
            symbol: value.symbol,
            decimals: value.decimals,
            logoURI: value?.logoURI,
          });
        } else {
          onChange(undefined);
        }
      }}
      getOptionLabel={(option) => {
        return option.name
          ? `${getChainSymbol(option.chainId)}-${option.name}`
          : '';
      }}
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
          {...props}
        >
          <img loading="lazy" width="20" src={`${option.logoURI}`} alt="" />
          {getChainName(option.chainId)} - {option.name} -
          {option?.symbol.toUpperCase() || ''}
        </Box>
      )}
      renderInput={(params) => (
        <>
          <TextField
            {...params}
            label={label || 'Search Token'}
            onChange={(ev) => setSearch(ev.currentTarget.value)}
            inputProps={{
              ...params.inputProps,
              autoComplete: 'off', // disable autocomplete and autofill
            }}
          />
          {false && (
            <Box sx={{ p: 2 }}>
              <Stack
                justifyContent={'center'}
                alignItems={'center'}
                alignContent={'center'}
                flexDirection={'row'}
              >
                <img
                  loading="lazy"
                  width="25"
                  src={`${formValue.logoURI}`}
                  alt=""
                />
                {formValue.chainId && (
                  <Box sx={{ pl: 1 }}>
                    {getChainName(formValue.chainId)} - {formValue.name} -
                    {formValue?.symbol?.toUpperCase()}
                  </Box>
                )}
              </Stack>
            </Box>
          )}
        </>
      )}
    />
  );
}
