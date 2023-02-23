import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { NETWORKS } from '../constants/chain';
import { ChainId } from '../constants/enum';
import { Network } from '../types/chains';

interface Props {
  chainId?: ChainId;
  onChange: (chainId: ChainId) => void;
}

export function NetworkSelectDropdown(props: Props) {
  const { chainId, onChange } = props;
  return (
    <FormControl>
      <Select
        fullWidth
        value={chainId}
        onChange={(ev) => onChange(Number(ev.target.value) as ChainId)}
        name="chainId"
        renderValue={(value) => {
          return (
            <Stack
              direction="row"
              alignItems="center"
              alignContent="center"
              spacing={1}
            >
              <Avatar
                src={NETWORKS[value].imageUrl || ''}
                style={{ width: 'auto', height: '1rem' }}
              />
              <Typography variant="body1">{NETWORKS[value].name}</Typography>
            </Stack>
          );
        }}
      >
        {Object.keys(NETWORKS)
          .filter((key) => !NETWORKS[Number(key)].testnet)
          .map((key: any, index: number) => (
            <MenuItem key={index} value={key}>
              <ListItemIcon>
                <Box
                  sx={{
                    width: (theme) => theme.spacing(4),
                    display: 'flex',
                    alignItems: 'center',
                    alignContent: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Avatar
                    src={(NETWORKS[key] as Network)?.imageUrl || ''}
                    sx={{
                      width: 'auto',
                      height: '1rem',
                    }}
                  />
                </Box>
              </ListItemIcon>
              <ListItemText primary={NETWORKS[key].name} />
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
}
