import Swap from '@/modules/swap/Swap';
import {
  Box,
  Button,
  Grid,
  Stack,
  TextField,
  Theme,
  ThemeProvider,
  Typography,
} from '@mui/material';
import { useIntl } from 'react-intl';
import { ChainId } from '../../../constants/enum';
import AssetFromApi from '../../nft/components/AssetFromApi';
import { KITTYGOTCHI_CONTRACT } from '../constants';

interface Props {
  selectedTheme: Theme;
  showSwap?: boolean;
}

export default function ThemePreview({ selectedTheme, showSwap }: Props) {
  const { formatMessage } = useIntl();

  return (
    <ThemeProvider theme={selectedTheme}>
      <Stack spacing={2}>
        <Box>
          {showSwap ? (
            <Swap />
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <AssetFromApi
                  chainId={ChainId.Polygon}
                  contractAddress={KITTYGOTCHI_CONTRACT}
                  tokenId="42"
                  disabled={true}
                />
              </Grid>
              <Grid item xs={6}>
                <AssetFromApi
                  chainId={ChainId.Polygon}
                  contractAddress={KITTYGOTCHI_CONTRACT}
                  tokenId="50"
                  disabled={true}
                />
              </Grid>
            </Grid>
          )}
        </Box>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Button>Button</Button>
          <Button variant="contained" color="primary">
            Button
          </Button>
          <Button variant="contained" color="secondary">
            Button
          </Button>
        </Stack>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Button variant="outlined" color="primary">
            Button
          </Button>
          <Button variant="outlined" color="secondary">
            Button
          </Button>
        </Stack>
        <Stack direction="row" spacing={1}>
          <TextField
            placeholder={formatMessage({
              id: 'text.field',
              defaultMessage: 'Text field',
            })}
            fullWidth
          />
        </Stack>
        <Stack>
          <Typography variant="h5">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit
          </Typography>
          <Typography variant="body1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit
          </Typography>
          <Typography variant="body2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit
          </Typography>
        </Stack>
      </Stack>
    </ThemeProvider>
  );
}
