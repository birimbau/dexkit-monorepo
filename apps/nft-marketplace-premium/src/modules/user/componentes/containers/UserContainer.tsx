import { StoreOrderbook } from '@/modules/nft/components/StoreOrderbook';
import { Edit } from '@mui/icons-material';
import {
  Container,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { PageHeader } from 'src/components/PageHeader';
import { useAssetsOrderBook } from 'src/hooks/nft';
import { useUserQuery } from '../../hooks';
import { UserHeader } from '../UserHeader';

export function UserContainer({ username }: { username?: string }) {
  const router = useRouter();
  const userQuery = useUserQuery(username);
  const user = userQuery?.data;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { formatMessage } = useIntl();
  const { account } = useWeb3React();
  const [search, setSearch] = useState<string>();
  const assetOrderbookQuery = useAssetsOrderBook({
    maker: user?.accounts[0].address,
  });
  const defaultAccount = user?.accounts[0].address;

  return (
    <>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Stack
              direction="row"
              alignItems="center"
              alignContent="center"
              justifyContent="space-between"
            >
              <PageHeader
                breadcrumbs={[
                  {
                    caption: (
                      <FormattedMessage id="home" defaultMessage="Home" />
                    ),
                    uri: '/',
                  },
                  {
                    caption: (
                      <FormattedMessage
                        id="user.profile"
                        defaultMessage="User profile"
                      />
                    ),
                    uri: '/u/edit',
                  },
                ]}
              />
            </Stack>
          </Grid>

          <Grid item xs={12} sm={12}>
            <Stack direction={'row'} spacing={2} alignItems={'center'}>
              {!isMobile && (
                <Typography variant="h5">
                  <FormattedMessage
                    id="user.profile.value"
                    defaultMessage="User Profile: {username}"
                    values={{
                      username: user?.username,
                    }}
                  />
                </Typography>
              )}
              {account?.toLowerCase() === defaultAccount && (
                <IconButton
                  onClick={() => router.push(`/u/${user?.username}/edit`)}
                >
                  <Edit />
                </IconButton>
              )}
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <UserHeader {...user} />
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Stack
              justifyContent="space-between"
              direction="row"
              alignItems="center"
              alignContent="center"
            ></Stack>
          </Grid>
          <Grid item xs={12}>
            <Grid item xs={12}>
              <StoreOrderbook
                search={search}
                orderbook={assetOrderbookQuery.data}
                isLoading={assetOrderbookQuery.isLoading}
              />
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
