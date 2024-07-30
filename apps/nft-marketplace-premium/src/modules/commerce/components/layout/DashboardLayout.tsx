import SellIcon from '@mui/icons-material/Sell';
import {
  Box,
  Button,
  Container,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { FormattedMessage } from 'react-intl';

import { DexkitApiProvider } from '@dexkit/core/providers';
import { myAppsApi } from '@dexkit/ui/constants/api';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import HomeIcon from '@mui/icons-material/Home';
import InboxIcon from '@mui/icons-material/Inbox';
import Settings from '@mui/icons-material/Settings';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import React from 'react';
import AuthMainLayout from 'src/components/layouts/authMain';

import ChevronRight from '@mui/icons-material/ChevronRight';
import Wallet from '@mui/icons-material/Wallet';
import { useConnectWalletDialog } from 'src/hooks/app';

export interface DashboardLayoutProps {
  children: React.ReactNode;
  page?: string;
}

function RequireLogin({
  page,
  children,
}: {
  page: string;
  children: React.ReactNode;
}) {
  const { isActive } = useWeb3React();

  const connectWalletDialog = useConnectWalletDialog();

  if (isActive) {
    return (
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <Paper>
              <List disablePadding>
                <ListItemButton
                  LinkComponent={Link}
                  href="/u/account/commerce"
                  divider
                  selected={page === 'home'}
                >
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <FormattedMessage id="home" defaultMessage="Home" />
                    }
                  />
                </ListItemButton>
                <ListItemButton
                  LinkComponent={Link}
                  href="/u/account/commerce/orders"
                  divider
                  selected={page === 'orders'}
                >
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <FormattedMessage id="Orders" defaultMessage="Orders" />
                    }
                  />
                </ListItemButton>
                <ListItemButton
                  LinkComponent={Link}
                  href="/u/account/commerce/checkouts"
                  divider
                  selected={page === 'checkouts'}
                >
                  <ListItemIcon>
                    <ShoppingCartIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <FormattedMessage
                        id="checkouts"
                        defaultMessage="Checkouts"
                      />
                    }
                  />
                </ListItemButton>
                <ListItemButton
                  divider
                  LinkComponent={Link}
                  href="/u/account/commerce/products"
                  selected={page === 'products'}
                >
                  <ListItemIcon>
                    <SellIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <FormattedMessage
                        id="products"
                        defaultMessage="Products"
                      />
                    }
                  />
                </ListItemButton>
                <ListItemButton
                  LinkComponent={Link}
                  href="/u/account/commerce/settings"
                  selected={page === 'settings'}
                >
                  <ListItemIcon>
                    <Settings />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <FormattedMessage
                        id="settings"
                        defaultMessage="Settings"
                      />
                    }
                  />
                </ListItemButton>
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={9}>
            <DexkitApiProvider.Provider value={{ instance: myAppsApi }}>
              {children}
            </DexkitApiProvider.Provider>
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Box py={4}>
      <Stack
        alignItems="center"
        justifyContent="center"
        alignContent="center"
        spacing={2}
      >
        <Stack
          alignItems="center"
          justifyContent="center"
          alignContent="center"
        >
          <Typography variant="h5">
            <FormattedMessage
              id="no.wallet.connected"
              defaultMessage="No Wallet connected"
            />
          </Typography>
          <Typography variant="body1" color="textSecondary">
            <FormattedMessage
              id="connect.wallet.to.see.apps.associated.with.your.account"
              defaultMessage="Connect wallet to see apps associated with your account"
            />
          </Typography>
        </Stack>
        <Button
          variant="outlined"
          color="inherit"
          onClick={() => connectWalletDialog.setOpen(true)}
          startIcon={<Wallet />}
          endIcon={<ChevronRight />}
        >
          <FormattedMessage
            id="connect.wallet"
            defaultMessage="Connect Wallet"
            description="Connect wallet button"
          />
        </Button>
      </Stack>
    </Box>
  );
}

export default function DashboardLayout({
  children,
  page,
}: DashboardLayoutProps) {
  return (
    <AuthMainLayout noSsr>
      <RequireLogin page={page ?? ''}>{children}</RequireLogin>
    </AuthMainLayout>
  );
}
