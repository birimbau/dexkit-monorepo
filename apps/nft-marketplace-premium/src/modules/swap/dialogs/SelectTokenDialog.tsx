import { ChainId } from '@dexkit/core/constants';
import { Close } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import { memo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useTokenList } from '../../../hooks/blockchain';
import { Token } from '../../../types/blockchain';
import { TOKEN_ICON_URL } from '../../../utils/token';

interface Props {
  dialogProps: DialogProps;
  onSelect: (token: Token) => void;
  excludeToken?: Token;
  chainId?: ChainId;
  includeNative?: boolean;
}

function SelectTokenDialog({
  dialogProps,
  onSelect,
  excludeToken,
  chainId,
  includeNative = true,
}: Props) {
  const { onClose } = dialogProps;
  const tokens = useTokenList({ chainId, includeNative });
  const [value, setValue] = useState('');

  const handleClose = () => {
    onClose!({}, 'backdropClick');
    setValue('');
  };

  return (
    <Dialog {...dialogProps} onClose={handleClose}>
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          alignContent: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="body1">
          <FormattedMessage
            id="select.a.token"
            defaultMessage={'Select a token'}
            description={'Select a token message'}
          />
        </Typography>
        <IconButton onClick={handleClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ px: 0 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ px: 2 }}>
              <TextField
                placeholder="Search for a token name"
                fullWidth
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <List disablePadding>
              {tokens
                ?.filter((token) => {
                  return excludeToken !== token;
                })
                ?.filter((token) => {
                  return (
                    token.name.toLowerCase().search(value.toLowerCase()) > -1 ||
                    token.symbol.toLowerCase().search(value.toLowerCase()) > -1
                  );
                })
                .map((token: Token, index: number) => (
                  <ListItemButton key={index} onClick={() => onSelect(token)}>
                    <ListItemIcon>
                      <Avatar
                        sx={(theme) => ({
                          width: 'auto',
                          height: theme.spacing(4),
                        })}
                        src={
                          token.logoURI
                            ? token.logoURI
                            : TOKEN_ICON_URL(token.address, chainId as ChainId)
                        }
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={token.symbol}
                      secondary={token.name}
                    />
                  </ListItemButton>
                ))}
            </List>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default memo(SelectTokenDialog);
