import CheckIcon from '@mui/icons-material/Check';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Info from '@mui/icons-material/Info';

import {
  Checkbox,
  Chip,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
} from '@mui/material';

export interface NetworksContainerListProps {
  networks: any[];
  onChange: (active: number[]) => void;
  isEditing?: boolean;
  exclude: number[];
  onShowInfo: (network: {
    name: string;
    symbol: string;
    chainId: number;
    decimals: number;
  }) => void;
}

export default function NetworksContainerList({
  networks,
  isEditing,
  exclude,
  onChange,
  onShowInfo,
}: NetworksContainerListProps) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <List disablePadding>
          {networks.map((network: any, index: number) => (
            <ListItem divider key={index}>
              <Stack>
                <ListItemText
                  primaryTypographyProps={{ marginTop: 0 }}
                  primary={network.name}
                />
                <Stack
                  display="none"
                  direction="row"
                  alignItems="center"
                  spacing={1}
                >
                  <Chip
                    icon={
                      <CheckIcon
                        sx={{
                          bgcolor: (theme) => theme.palette.action.selected,
                          borderRadius: '50%',
                        }}
                        color="success"
                      />
                    }
                    label="Swap"
                    size="small"
                  />
                  <Chip
                    icon={
                      <CloseRoundedIcon
                        sx={{
                          bgcolor: (theme) => theme.palette.action.selected,
                          borderRadius: '50%',
                        }}
                        color="error"
                      />
                    }
                    label="Exchange"
                    size="small"
                  />
                </Stack>
              </Stack>
              <ListItemSecondaryAction>
                {isEditing ? (
                  <Checkbox
                    checked={exclude.includes(network.chainId)}
                    onClick={() => {
                      if (exclude.includes(network.chainId)) {
                        onChange(exclude.filter((n) => n !== network.chainId));
                      } else {
                        onChange([...exclude, network.chainId]);
                      }
                    }}
                  />
                ) : (
                  <IconButton
                    onClick={() =>
                      onShowInfo({
                        name: network.name,
                        symbol: network.nativeSymbol,
                        chainId: network.chainId,
                        decimals: network.decimals,
                      })
                    }
                  >
                    <Info />
                  </IconButton>
                )}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Grid>
    </Grid>
  );
}
