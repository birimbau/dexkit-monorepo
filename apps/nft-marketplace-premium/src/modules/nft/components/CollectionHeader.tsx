import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Box from '@mui/material/Box';

import { ChainId } from '../../../constants/enum';
import { useCollection } from '../../../hooks/nft';
import { useMemo } from 'react';
import { getAppConfig } from '../../../services/app';
import { isAddressEqual } from '../../../utils/blockchain';

import Image from 'next/image';
import { styled, useTheme } from '@mui/material';
import { useAppConfig } from '../../../hooks/app';

const Img = styled(Image)({});

interface Props {
  address: string;
  chainId?: ChainId;
}

export function CollectionHeader(props: Props) {
  const appConfig = useAppConfig();

  const { address, chainId } = props;
  const { data: collection } = useCollection(address, chainId);

  const collectionImage = useMemo(() => {
    return (
      appConfig.collections?.find(
        (c) =>
          c.chainId === collection?.chainId &&
          isAddressEqual(c.contractAddress, collection?.address)
      )?.backgroundImage || collection?.imageUrl
    );
  }, [collection]);

  const theme = useTheme();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                algnItems: 'center',
                alignContent: 'center',
                justifyContent: { xs: 'center', sm: 'left' },
              }}
            >
              {collectionImage ? (
                <Box
                  sx={(theme) => ({
                    position: 'relative',
                    height: theme.spacing(14),
                    width: theme.spacing(14),
                    borderRadius: '50%',
                  })}
                >
                  <img
                    src={collectionImage}
                    alt={collection?.name}
                    height={theme.spacing(14)}
                    width={theme.spacing(14)}
                  />
                </Box>
              ) : (
                <Avatar
                  sx={(theme) => ({
                    height: theme.spacing(14),
                    width: theme.spacing(14),
                  })}
                />
              )}
            </Box>
          </Grid>
          <Grid item xs>
            <Typography
              sx={{
                display: 'block',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                textAlign: { xs: 'center', sm: 'left' },
              }}
              variant="h5"
              component="h1"
            >
              {collection?.name}
            </Typography>
          </Grid>
          {collection?.description && (
            <Grid item xs={12}>
              <Typography
                sx={{
                  display: 'block',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  textAlign: { xs: 'center', sm: 'left' },
                }}
                variant="body2"
                component="p"
              >
                {collection?.description}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}
