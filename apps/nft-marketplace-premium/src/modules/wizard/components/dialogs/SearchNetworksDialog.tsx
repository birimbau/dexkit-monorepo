import { useDebounce } from '@dexkit/core';
import { AppDialogTitle } from '@dexkit/ui';
import { useSearchUnactive } from '@dexkit/ui/hooks/networks';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

interface SearchNetworksDialogProps {
  DialogProps: DialogProps;
  onSelect: (ids: number[]) => void;
}

const PAGE_SIZE = 5;

export default function SearchNetworksDialog({
  DialogProps,
  onSelect,
}: SearchNetworksDialogProps) {
  const { onClose } = DialogProps;
  const [page, setPage] = useState(1);
  const [queryText, setQueryText] = useState('');

  const query = useDebounce<string>(queryText, 500);

  const networksQuery = useSearchUnactive({
    page,
    limit: PAGE_SIZE,
    query,
  });

  const canNext = useMemo(() => {
    return (
      networksQuery &&
      networksQuery.data?.pages[page - 1]?.data?.length === PAGE_SIZE
    );
  }, [networksQuery.data, page]);

  const canPrev = useMemo(() => {
    return page - 1 > 0;
  }, [page]);

  const handleNextPage = async () => {
    await networksQuery.fetchNextPage();
    setPage((page) => {
      if (canNext) {
        return page + 1;
      }

      return page;
    });
  };

  const handlePrevPage = async () => {
    await networksQuery.fetchPreviousPage();

    setPage((page) => {
      if (canPrev) {
        return page - 1;
      }

      return page;
    });
  };

  const [selectedNetworks, setSelectedNetworks] = useState<any[]>([]);

  const handleToggleNetwork = (network: any) => {
    return () => {
      if (selectedNetworks.find((n) => n.id === network.id)) {
        setSelectedNetworks(
          selectedNetworks.filter((n) => n.id !== network.id)
        );
      } else {
        setSelectedNetworks([...selectedNetworks, network]);
      }
    };
  };

  const isSelected = useCallback(
    (network: any) => {
      return selectedNetworks.find((n) => n.id === network.id);
    },
    [selectedNetworks]
  );

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'escapeKeyDown');
      setSelectedNetworks([]);
    }
  };

  const handleConfirm = () => {
    onSelect(selectedNetworks.map((n: any) => n.chainId) as number[]);
    setSelectedNetworks([]);
  };

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage id="add.networks" defaultMessage="Add Networks" />
        }
        onClose={handleClose}
      />
      <DialogContent dividers sx={{ p: 0 }}>
        <Stack>
          <Box sx={{ p: 2 }}>
            <TextField
              label="Search"
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              fullWidth
            />
          </Box>
          <Divider />
          {networksQuery.data?.pages[0]?.data?.length === 0 && (
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
          {networksQuery.isLoading && (
            <List>
              {new Array(4).fill(null).map((_, key) => (
                <ListItem key={key}>
                  <ListItemText primary={<Skeleton />} />
                </ListItem>
              ))}
            </List>
          )}

          <List disablePadding>
            {networksQuery.data?.pages[page - 1]?.data.map((network) => (
              <ListItemButton
                key={network.id}
                onClick={handleToggleNetwork(network)}
              >
                <ListItemText primary={network.name} />
                <ListItemSecondaryAction>
                  <Checkbox checked={isSelected(network)} />
                </ListItemSecondaryAction>
              </ListItemButton>
            ))}
          </List>
          <Divider />
          <Stack
            justifyContent="space-between"
            direction="row"
            spacing={2}
            sx={{ p: 2 }}
          >
            <IconButton disabled={!canPrev} onClick={handlePrevPage}>
              <KeyboardArrowLeftIcon />
            </IconButton>
            <IconButton disabled={!canNext} onClick={handleNextPage}>
              <KeyboardArrowRightIcon />
            </IconButton>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirm} variant="contained">
          <FormattedMessage id="save" defaultMessage="Save" />
        </Button>
        <Button onClick={handleClose}>
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
