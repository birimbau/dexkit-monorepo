import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';

import { EVM_CHAINS } from '@dexkit/evm-chains';
import { useActiveChainIds } from '@dexkit/ui';
import Add from '@mui/icons-material/Add';
import Close from '@mui/icons-material/Close';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

import NetworksContainerList from '../NetworksContainerList';
import SearchNetworksDialog from '../dialogs/SearchNetworksDialog';
import ViewNetworkInfoDialog from '../dialogs/ViewNetworkInfoDialog';

export interface NetworksWizardContainerProps {
  siteId?: number;
}

export default function NetworksWizardContainer({
  siteId,
}: NetworksWizardContainerProps) {
  const { formatMessage } = useIntl();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [page, setPage] = useState<number>(1);

  const { activeChainIds } = useActiveChainIds();

  const { enqueueSnackbar } = useSnackbar();

  const [exclude, setExclude] = useState<number[]>([]);

  const handleChange = (active: number[]) => {
    setExclude(active);
  };

  const handleDelete = async () => {
    try {
      if (exclude.length > 0 && siteId !== undefined) {
        setExclude([]);
        setIsEditing(false);
      }

      enqueueSnackbar(formatMessage({ id: 'saved', defaultMessage: 'Saved' }), {
        variant: 'success',
      });
    } catch (err) {
      enqueueSnackbar(String(err), { variant: 'error' });
    }
  };

  const [showNetworks, setShowNetworks] = useState(false);

  const handleSelect = async (ids: number[]) => {
    setShowNetworks(false);

    try {
      enqueueSnackbar(formatMessage({ id: 'saved', defaultMessage: 'Saved' }), {
        variant: 'success',
      });
    } catch (err) {
      enqueueSnackbar(String(err), { variant: 'error' });
    }
  };

  const handleClose = () => {
    setShowNetworks(false);
  };

  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleAddNetwork = () => {
    setShowNetworks(true);
  };

  const [networkInfo, setNetworkInfo] = useState<{
    name: string;
    symbol: string;
    chainId: number;
    decimals: number;
  }>();

  const handleCloseNetworkInfo = () => {
    setNetworkInfo(undefined);
  };

  return (
    <>
      {showNetworks && (
        <SearchNetworksDialog
          DialogProps={{
            open: showNetworks,
            onClose: handleClose,
            fullWidth: true,
            maxWidth: 'sm',
          }}
          onSelect={handleSelect}
        />
      )}

      {networkInfo && (
        <ViewNetworkInfoDialog
          DialogProps={{
            open: Boolean(networkInfo),
            onClose: handleCloseNetworkInfo,
            fullWidth: true,
            maxWidth: 'sm',
          }}
          network={networkInfo}
        />
      )}
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Grid item>
                    <Button
                      onClick={handleAddNetwork}
                      variant="contained"
                      startIcon={<Add />}
                    >
                      <FormattedMessage
                        id="add.network"
                        defaultMessage="Add Network"
                      />
                    </Button>
                  </Grid>
                  <Grid item>
                    {isEditing ? (
                      <Box>
                        <Stack spacing={1} direction="row">
                          <Button
                            size="small"
                            onClick={handleDelete}
                            variant="outlined"
                            startIcon={<Delete />}
                            color="error"
                          >
                            <FormattedMessage
                              id="remove"
                              defaultMessage="Remove"
                            />
                          </Button>
                          <Button
                            size="small"
                            onClick={handleCancel}
                            startIcon={<Close />}
                          >
                            <FormattedMessage
                              id="cancel"
                              defaultMessage="Cancel"
                            />
                          </Button>
                        </Stack>
                      </Box>
                    ) : (
                      <Button
                        size="small"
                        onClick={handleEdit}
                        variant="outlined"
                        startIcon={<Edit />}
                      >
                        <FormattedMessage id="edit" defaultMessage="Edit" />
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
              <Divider />
              {false && (
                <Stack sx={{ p: 2 }}>
                  <Box>
                    <Typography textAlign="center" variant="h5">
                      <FormattedMessage
                        id="no.networks"
                        defaultMessage="No networks"
                      />
                    </Typography>
                    <Typography
                      textAlign="center"
                      variant="body1"
                      color="text.secondary"
                    >
                      <FormattedMessage
                        id="no.networks.are.available"
                        defaultMessage="No networks are available"
                      />
                    </Typography>
                  </Box>
                </Stack>
              )}
              {/*activeNetworksQuery.isLoading &&
                new Array(4).fill(null).map((_, key) => (
                  <ListItem key={key}>
                    <ListItemText primary={<Skeleton />} />
                  </ListItem>
                ))*/}

              <NetworksContainerList
                networks={EVM_CHAINS}
                onChange={handleChange}
                isEditing={isEditing}
                exclude={activeChainIds}
                onShowInfo={(network: any) => setNetworkInfo(network)}
              />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
