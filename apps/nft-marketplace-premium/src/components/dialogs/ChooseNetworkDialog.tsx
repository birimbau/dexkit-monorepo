import { ChainId } from '@dexkit/core/constants';
import { useNetworkMetadata } from '@dexkit/ui/hooks/app';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Radio,
  Stack,
} from '@mui/material';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Network } from '../../types/chains';
import { AppDialogTitle } from '../AppDialogTitle';

interface Props {
  dialogProps: DialogProps;
  onChange: (chainId: number) => void;
  selectedChainId?: ChainId;
}

function ChooseNetworkDialog({
  dialogProps,
  onChange,
  selectedChainId,
}: Props) {
  const { NETWORKS } = useNetworkMetadata();
  const { onClose } = dialogProps;

  const [chainId, setChainId] = useState<number | undefined>(selectedChainId);

  const handleClose = () => onClose!({}, 'backdropClick');

  const handleSwitchNetwork = async () => {
    if (chainId !== undefined) {
      onChange(chainId);
      handleClose();
    }
  };

  const handleSelectNetwork = (id: number) => {
    if (id === chainId) {
      return setChainId(undefined);
    }

    setChainId(id);
  };

  return (
    <Dialog {...dialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="select.network"
            defaultMessage="Select Network"
            description="select network dialog title"
          />
        }
        onClose={handleClose}
      />
      <DialogContent dividers sx={{ p: 0 }}>
        <Stack spacing={2}>
          <List disablePadding>
            {Object.keys(NETWORKS)
              .filter((k) => !NETWORKS[parseInt(k)].testnet)
              .map((key: any, index: number) => (
                <ListItemButton
                  selected={(NETWORKS[key] as Network).chainId === chainId}
                  key={index}
                  onClick={() =>
                    handleSelectNetwork((NETWORKS[key] as Network).chainId)
                  }
                >
                  <ListItemIcon>
                    <Box
                      sx={{
                        width: (theme) => theme.spacing(6),
                        display: 'flex',
                        alignItems: 'center',
                        alignContent: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Avatar
                        src={(NETWORKS[key] as Network).imageUrl}
                        sx={(theme) => ({
                          width: 'auto',
                          height: theme.spacing(4),
                        })}
                        alt={(NETWORKS[key] as Network).name}
                      />
                    </Box>
                  </ListItemIcon>

                  <ListItemText
                    primary={(NETWORKS[key] as Network).name}
                    secondary={(NETWORKS[key] as Network).symbol}
                  />
                  <ListItemSecondaryAction>
                    <Radio
                      name="chainId"
                      checked={(NETWORKS[key] as Network).chainId === chainId}
                    />
                  </ListItemSecondaryAction>
                </ListItemButton>
              ))}
          </List>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSwitchNetwork}
        >
          <FormattedMessage
            id="select"
            defaultMessage="Select"
            description="select"
          />
        </Button>
        <Button onClick={handleClose}>
          <FormattedMessage
            id="cancel"
            defaultMessage="Cancel"
            description="Cancel"
          />
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ChooseNetworkDialog;
