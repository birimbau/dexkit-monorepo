import CheckIcon from '@mui/icons-material/Check';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import {
  Chip,
  Grid,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  Switch,
} from '@mui/material';

export interface NetworksContainerListProps {
  networks: any[];
  activeNetworks: number[];
  onChange: (active: number[]) => void;
}

export default function NetworksContainerList({
  networks,
  activeNetworks,
  onChange,
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
                <Stack direction="row" alignItems="center" spacing={1}>
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
                <Switch
                  edge="end"
                  checked={activeNetworks?.includes(network.chainId)}
                  onChange={(e) => {
                    let newActive;

                    if (!activeNetworks?.includes(network.chainId)) {
                      newActive = [...activeNetworks, network.chainId];
                    } else {
                      newActive = activeNetworks.filter(
                        (c) => c !== network.chainId
                      );
                    }
                    onChange(newActive);
                  }}
                />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Grid>
    </Grid>
  );
}
