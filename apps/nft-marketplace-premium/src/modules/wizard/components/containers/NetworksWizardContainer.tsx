import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  InputAdornment,
  TextField,
} from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';

import { useDebounce } from '@dexkit/core';
import SearchIcon from '@mui/icons-material/Search';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import {
  useActiveNetworks,
  useSearchNetworks,
  useSetNetworksActive,
} from '../../hooks/networks';
import NetworksContainerList from '../NetworksContainerList';

export interface NetworksWizardContainerProps {}

export default function NetworksWizardContainer({}: NetworksWizardContainerProps) {
  const { formatMessage } = useIntl();

  const [searchQuery, setSearchQuery] = useState<string>('');

  const [page, setPage] = useState<number>(1);

  const query = useDebounce<string>(searchQuery, 500);

  const networks = useSearchNetworks({ limit: 10, page, query });

  const [activeNetworks, setActiveNetworks] = useState<number[]>([]);

  const activeNetworksQuery = useActiveNetworks({
    limit: 10,
    page: 1,
    query: query,
    siteId: 8,
  });

  useEffect(() => {
    if (activeNetworksQuery.data && activeNetworksQuery.isSuccess) {
      setActiveNetworks(
        activeNetworksQuery.data.pages[0]?.map((n: any) => n.chainId) || []
      );
    }
  }, [activeNetworksQuery.data, activeNetworksQuery.isSuccess]);

  const setActiveNetworksMutation = useSetNetworksActive();

  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (active: number[]) => {
    setActiveNetworks(active);
  };

  const handleSave = async () => {
    try {
      if (activeNetworks.length > 0) {
        await setActiveNetworksMutation.mutateAsync({
          networks: activeNetworks,
          siteId: 7,
        });
      }

      enqueueSnackbar(formatMessage({ id: 'saved', defaultMessage: 'Saved' }), {
        variant: 'success',
      });
    } catch (err) {
      enqueueSnackbar(String(err), { variant: 'error' });
    }
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={formatMessage({
                      id: 'search.for.networks',
                      defaultMessage: 'Search for networks',
                    })}
                  />
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
            {activeNetworksQuery.data &&
              activeNetworksQuery.data.pages[0] &&
              networks.data &&
              networks.data.pages[0].data && (
                <NetworksContainerList
                  activeNetworks={activeNetworks}
                  networks={networks.data?.pages[0].data || []}
                  onChange={handleChange}
                />
              )}
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Button onClick={handleSave} variant="contained">
            <FormattedMessage id="save" defaultMessage="Save" />
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
