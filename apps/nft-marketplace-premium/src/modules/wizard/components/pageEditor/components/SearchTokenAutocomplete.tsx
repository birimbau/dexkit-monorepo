import { useSearchSwapTokens } from '@/modules/swap/hooks';
import { CircularProgress, Stack } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import React, { useMemo, useState } from 'react';
import { NETWORKS } from '../../../../../constants/chain';
import { getChainName, getChainSlug } from '../../../../../utils/blockchain';

interface Props {
  label?: string | React.ReactNode;
  chainId?: number;
  data?: any;
  disabled?: boolean;
  onChange?: any;
}

export function SearchTokenAutocomplete(props: Props) {
  const { data, label, onChange, chainId, disabled } = props;
  const [search, setSearch] = useState<string>();
  const tokensQuery = useSearchSwapTokens({
    keyword: search,
    network: getChainSlug(chainId),
  });
  const formValue = data;

  const assets = useMemo(() => {
    return (
      tokensQuery.tokens?.map((value) => {
        return {
          name: (value.name as string) || '',
          address: value.address.toLowerCase(),
          symbol: value.symbol,
          network: Object.values(NETWORKS).find(
            (n) => n.chainId === value?.chainId
          )?.name,
          chainId: value.chainId as number,
          image: value.logoURI,
          decimals: value.decimals,
        };
      }) || []
    );
  }, [formValue, tokensQuery.tokens, chainId]);

  return (
    <Autocomplete
      id="search-token"
      disabled={disabled}
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
            image: value.image,
            decimals: value.decimals,
          });
        } else {
          onChange(undefined);
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
              autoComplete: 'new-password', // disable autocomplete and autofill
              endAdornment: (
                <React.Fragment>
                  {tokensQuery.isLoading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
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
                  src={`${formValue.image}`}
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
