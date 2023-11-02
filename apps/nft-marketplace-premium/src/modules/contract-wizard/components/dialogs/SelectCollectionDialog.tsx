import { ChainId } from '@dexkit/core';
import { isAddressEqual } from '@dexkit/core/utils';
import { AppDialogTitle } from '@dexkit/ui';
import {
  Avatar,
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
} from '@mui/material';
import { useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useCollections } from 'src/hooks/app';
import { AppCollection } from 'src/types/config';

export interface SelectCollectionDialogProps {
  DialogProps: DialogProps;
  chainId?: ChainId;
  onSelect: (collection: AppCollection) => void;
}

export default function SelectCollectionDialog({
  DialogProps,
  chainId,
  onSelect,
}: SelectCollectionDialogProps) {
  const { onClose } = DialogProps;

  const [selectedCollection, setSelectedCollection] = useState<AppCollection>();

  const collectionsList = useCollections();

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
    setSelectedCollection(undefined);
  };

  const collections = useMemo(() => {
    return collectionsList?.filter((c) => c.chainId === chainId);
  }, []);

  const handleSelect = () => {
    if (selectedCollection) {
      onSelect(selectedCollection);
      setSelectedCollection(undefined);
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
        <List disablePadding>
          {collections?.map((collection, key) => (
            <ListItemButton
              key={key}
              onClick={() => setSelectedCollection(collection)}
            >
              <ListItemAvatar>
                <Avatar src={collection.image} />
              </ListItemAvatar>
              <ListItemText primary={collection.name} />
              <ListItemSecondaryAction>
                <Radio
                  checked={isAddressEqual(
                    collection.contractAddress,
                    selectedCollection?.contractAddress,
                  )}
                />
              </ListItemSecondaryAction>
            </ListItemButton>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleSelect}>
          <FormattedMessage id="confirm" defaultMessage="Confirm" />
        </Button>
        <Button onClick={handleClose}>
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
