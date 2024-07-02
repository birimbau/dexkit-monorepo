import { NETWORKS } from '@dexkit/core/constants/networks';
import { Network } from '@dexkit/core/types';
import { parseChainId } from '@dexkit/core/utils';
import { useActiveChainIds } from '@dexkit/ui';
import { Autocomplete, TextField } from '@mui/material';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';

export interface TokensTableNetworkAutocompleteProps {
  selectedNetwoks: Network[];
  onChange: (selectedNetwoks: Network[]) => void;
}

export default function TokensTableNetworkAutocomplete({
  selectedNetwoks,
  onChange,
}: TokensTableNetworkAutocompleteProps) {
  const { activeChainIds } = useActiveChainIds();

  const networks = useMemo(() => {
    return Object.keys(NETWORKS)
      .filter((n) => activeChainIds.includes(Number(n)))
      .map((key) => NETWORKS[parseChainId(key)]);
  }, [activeChainIds]);

  const { formatMessage } = useIntl();

  return (
    <Autocomplete
      options={networks}
      value={selectedNetwoks}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          placeholder={formatMessage({
            id: 'select.network',
            defaultMessage: 'Select Network',
          })}
        />
      )}
      getOptionLabel={(opt) => opt.name}
      multiple
      onChange={(e, value) => {
        onChange(value);
      }}
    />
  );
}
