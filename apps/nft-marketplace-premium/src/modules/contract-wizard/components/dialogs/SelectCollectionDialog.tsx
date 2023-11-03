import { useListDeployedContracts } from '@/modules/forms/hooks';
import { ChainId } from '@dexkit/core';
import { isAddressEqual } from '@dexkit/core/utils';
import { AppDialogTitle } from '@dexkit/ui';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Radio,
  Stack,
  Typography,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useCollections } from 'src/hooks/app';
import SelectCollectionListItem from './SelectCollectionListItem';

export interface SelectCollectionDialogProps {
  DialogProps: DialogProps;
  chainId?: ChainId;
  onSelect: (address: string) => void;
}

export default function SelectCollectionDialog({
  DialogProps,
  chainId,
  onSelect,
}: SelectCollectionDialogProps) {
  const { onClose } = DialogProps;

  const [selectedContractAddr, setSelectedContractAddr] = useState<string>();

  const collectionsList = useCollections();

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
    setSelectedContractAddr(undefined);
  };

  const collections = useMemo(() => {
    return collectionsList?.filter((c) => c.chainId === chainId);
  }, []);

  const { account } = useWeb3React();

  const [queryOptions, setQueryOptions] = useState<any>({
    filter: { owner: account?.toLowerCase() },
  });

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const { data: collectionsData, isLoading } = useListDeployedContracts({
    ...queryOptions,
    ...paginationModel,
  });

  const data = useMemo(() => {
    if (collectionsData) {
      return collectionsData?.data.filter((c) => c.chainId === chainId);
    }

    return [];
  }, [collectionsData]);

  const handleSelect = (address: string) => {
    setSelectedContractAddr(address);
  };

  const handleConfirm = () => {
    if (selectedContractAddr) {
      onSelect(selectedContractAddr);
    }
  };

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        onClose={handleClose}
        title={
          <FormattedMessage
            id="select.collection"
            defaultMessage="Select collection"
          />
        }
      />
      <DialogContent dividers sx={{ p: 0 }}>
        {(data && data.length > 0) ||
        (collections && collections?.length > 0) ? (
          <List disablePadding>
            {data.map((collection) => (
              <SelectCollectionListItem
                key={collection.contractAddress}
                contractAddress={collection.contractAddress}
                onSelect={handleSelect}
              />
            ))}
            {collections?.map((collection, key) => (
              <ListItemButton
                key={key}
                onClick={() =>
                  setSelectedContractAddr(collection.contractAddress)
                }
              >
                <ListItemAvatar>
                  <Avatar src={collection.image} />
                </ListItemAvatar>
                <ListItemText primary={collection.name} />
                <ListItemSecondaryAction>
                  <Radio
                    checked={isAddressEqual(
                      collection.contractAddress,
                      selectedContractAddr,
                    )}
                  />
                </ListItemSecondaryAction>
              </ListItemButton>
            ))}
          </List>
        ) : (
          <Box py={2}>
            <Stack justifyContent="center">
              <Typography variant="h5" align="center">
                <FormattedMessage
                  id="no.collections"
                  defaultMessage="No collections"
                />
              </Typography>
              <Typography color="text.secondary" variant="body1" align="center">
                <FormattedMessage
                  id="deploy.a.collection.to.see.it.here"
                  defaultMessage="Deploy a collection to see it here"
                />
              </Typography>
            </Stack>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          disabled={!selectedContractAddr}
          variant="contained"
          onClick={handleConfirm}
        >
          <FormattedMessage id="confirm" defaultMessage="Confirm" />
        </Button>
        <Button onClick={handleClose}>
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
