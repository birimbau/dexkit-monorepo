import { ChainId } from '@dexkit/core/constants';
import { Box, Button, Grid, Stack, TextField, Typography } from '@mui/material';
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  CssVarsTheme,
  Theme,
} from '@mui/material/styles';
import { useIntl } from 'react-intl';

import AssetFromApi from '../../nft/components/AssetFromApi';
import { KITTYGOTCHI_CONTRACT } from '../constants';
import SwapWidget from './pageEditor/components/SwapWidget';

interface Props {
  selectedTheme: Omit<Theme, 'palette'> & CssVarsTheme;
  showSwap?: boolean;
}

export default function ThemePreview({ selectedTheme, showSwap }: Props) {
  const { formatMessage } = useIntl();

  return (
    <CssVarsProvider theme={selectedTheme}>
      <Stack spacing={2}>
        <Box>
          {showSwap ? (
            <SwapWidget />
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
    </CssVarsProvider>
  );
}
