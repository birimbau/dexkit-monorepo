import { ChainId } from '@dexkit/core';
import { NETWORKS } from '@dexkit/core/constants/networks';
import { parseChainId } from '@dexkit/core/utils';
import { useActiveChainIds } from '@dexkit/ui';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Grid,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useCallback, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import useCheckoutNetworks from '../hooks/settings/useCheckoutNetworks';
import useUpdateCheckoutNetworks from '../hooks/settings/useUpdateCheckoutNetworks';

interface CheckoutNetworksBaseProps {
  networks: { chainId: number }[];
}

function CheckoutNetworksBase({ networks }: CheckoutNetworksBaseProps) {
  const { activeChainIds } = useActiveChainIds();

  const availNetworks = useMemo(() => {
    return Object.keys(NETWORKS)
      .map((key: string) => NETWORKS[parseChainId(key)])
      .filter((n) => ![ChainId.Goerli, ChainId.Mumbai].includes(n.chainId))
      .filter((n) => activeChainIds.includes(n.chainId));
  }, []);

  const value: { [key: string]: boolean } = networks.reduce(
    (prev, curr: { chainId: number }) => {
      prev[curr.chainId.toString()] = true;

      return prev;
    },
    {} as { [key: string]: boolean },
  );

  const [checked, setChecked] = useState<{ [key: string]: boolean }>(value);

  const handleToggle = useCallback((chainId: ChainId) => {
    return () => {
      setChecked((values) => ({
        ...values,
        [chainId]: !Boolean(values[chainId]),
      }));
    };
  }, []);

  const { mutateAsync: update } = useUpdateCheckoutNetworks();

  const { enqueueSnackbar } = useSnackbar();

  const handleSave = async () => {
    const chainIds = Object.keys(checked)
      .filter((n) => checked[n])
      .map(Number);

    try {
      await update({ chainIds });
      enqueueSnackbar(
        <FormattedMessage
          id="networks.updated"
          defaultMessage="Networks updated"
        />,
        { variant: 'success' },
      );
    } catch (err) {
      enqueueSnackbar(String(err), { variant: 'error' });
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card sx={{ overflowY: 'auto', height: (theme) => theme.spacing(26) }}>
          <List>
            {availNetworks.map((network, key) => (
              <ListItem key={key}>
                <ListItemText primary={network.name} />
                <ListItemSecondaryAction>
                  <Checkbox
                    checked={Boolean(checked[network.chainId])}
                    onClick={handleToggle(network.chainId)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Box>
          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button>
              <FormattedMessage id="cancel" defaultMessage="Cancel" />
            </Button>
            <Button variant="contained" onClick={handleSave}>
              <FormattedMessage id="save" defaultMessage="Save" />
            </Button>
          </Stack>
        </Box>
      </Grid>
    </Grid>
  );
}

export default function CheckoutNetworksUpdateForm() {
  const { data: networks, isFetchedAfterMount } = useCheckoutNetworks();

  return (
    networks &&
    isFetchedAfterMount && <CheckoutNetworksBase networks={networks ?? []} />
  );
}
