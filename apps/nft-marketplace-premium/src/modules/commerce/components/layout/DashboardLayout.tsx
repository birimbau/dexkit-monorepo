import MainLayout from '@dexkit/ui/components/layouts/main';
import SellIcon from '@mui/icons-material/Sell';
import {
  Container,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material';
import Link from 'next/link';
import { FormattedMessage } from 'react-intl';

import { DexkitApiProvider } from '@dexkit/core/providers';
import { myAppsApi } from '@dexkit/ui/constants/api';
import HomeIcon from '@mui/icons-material/Home';
import InboxIcon from '@mui/icons-material/Inbox';
import Settings from '@mui/icons-material/Settings';

export interface DashboardLayoutProps {
  children: React.ReactNode;
  page?: string;
}

export default function DashboardLayout({
  children,
  page,
}: DashboardLayoutProps) {
  return (
    <MainLayout>
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
                  href="/u/account/commerce/checkouts"
                  divider
                  selected={page === 'checkouts'}
                >
                  <ListItemIcon>
                    <InboxIcon />
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
    </MainLayout>
  );
}
