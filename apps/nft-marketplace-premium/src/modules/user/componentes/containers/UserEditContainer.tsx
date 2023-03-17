import Box from '@mui/material/Box';

import Close from '@mui/icons-material/Close';
import {
  Button,
  Container,
  Divider,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Stack,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import AppConfirmDialog from 'src/components/AppConfirmDialog';
import { PageHeader } from 'src/components/PageHeader';
import { useUpsertUserMutation, useUserQuery } from '../../hooks';
import { UserOptions } from '../../types';
import UpsertUserDialog from '../dialogs/UpsertuserDialog';
import UserGeneralForm from '../forms/UserGeneralForm';
import { UserAccounts } from '../UserAccounts';
import { UserSocials } from '../UserSocials';

interface Props {
  username?: string;
}

enum ActiveMenu {
  General,
  Accounts,
  Socials,
  Airdrop,
}

const ListSubheaderCustom = styled(ListSubheader)({
  fontWeight: 'bold',
});

export function UserEditContainer({ username }: Props) {
  const userQuery = useUserQuery(username);
  const user = userQuery.data;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [userForm, setUserForm] = useState<UserOptions>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<ActiveMenu>(ActiveMenu.General);
  const upsertUserMutation = useUpsertUserMutation();
  const [showUpsertUser, setShowUpsertUser] = useState(false);

  const [showConfirmUpsertUser, setShowConfirmUpsertUser] = useState(false);
  const handleCloseConfirmSendConfig = () => {
    setShowConfirmUpsertUser(false);
  };

  const handleConfirmSendConfig = async () => {
    setShowConfirmUpsertUser(false);
    setShowUpsertUser(true);
    upsertUserMutation.mutate(userForm);
  };

  const renderMenu = () => (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <nav aria-label="settings">
        <List
          disablePadding
          subheader={
            <ListSubheaderCustom>
              <FormattedMessage id="settings" defaultMessage={'Settings'} />
            </ListSubheaderCustom>
          }
        >
          <ListItem disablePadding>
            <ListItemButton
              selected={activeMenu === ActiveMenu.General}
              onClick={() => setActiveMenu(ActiveMenu.General)}
            >
              <ListItemText
                primary={
                  <FormattedMessage id="general" defaultMessage={'General'} />
                }
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              selected={activeMenu === ActiveMenu.Accounts}
              onClick={() => setActiveMenu(ActiveMenu.Accounts)}
            >
              <ListItemText
                primary={
                  <FormattedMessage id="accounts" defaultMessage={'Accounts'} />
                }
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              selected={activeMenu === ActiveMenu.Socials}
              onClick={() => setActiveMenu(ActiveMenu.Socials)}
            >
              <ListItemText
                primary={
                  <FormattedMessage id="socials" defaultMessage={'Socials'} />
                }
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              selected={activeMenu === ActiveMenu.Airdrop}
              onClick={() => setActiveMenu(ActiveMenu.Airdrop)}
            >
              <ListItemText
                primary={
                  <FormattedMessage id="Airdrop" defaultMessage={'Airdrop'} />
                }
              />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
    </Box>
  );

  return (
    <>
      <Drawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
        <Box
          sx={(theme) => ({ minWidth: `${theme.breakpoints.values.sm / 2}px` })}
        >
          <Box sx={{ p: 2 }}>
            <Stack
              direction="row"
              alignItems="center"
              alignContent="center"
              justifyContent="space-between"
            >
              <Typography sx={{ fontWeight: 600 }} variant="subtitle1">
                <FormattedMessage id="menu" defaultMessage="Menu" />
              </Typography>
              <IconButton onClick={() => setIsMenuOpen(false)}>
                <Close />
              </IconButton>
            </Stack>
          </Box>
          <Divider />
          <Box sx={{ p: 2 }}>{renderMenu()}</Box>
        </Box>
      </Drawer>
      <AppConfirmDialog
        dialogProps={{
          open: showConfirmUpsertUser,
          maxWidth: 'xs',
          fullWidth: true,
          onClose: handleCloseConfirmSendConfig,
        }}
        onConfirm={handleConfirmSendConfig}
      >
        <Stack>
          <Typography variant="h5" align="center">
            <FormattedMessage
              id="create.user.profile"
              defaultMessage="Create user profile"
            />
          </Typography>
          <Typography variant="body1" align="center" color="textSecondary">
            <FormattedMessage
              id="do.you.really.want.to.create.your.user.profile"
              defaultMessage="Do you really want to create your user profile?"
            />
          </Typography>
        </Stack>
      </AppConfirmDialog>
      <UpsertUserDialog
        dialogProps={{
          open: showUpsertUser,
          maxWidth: 'xs',
          fullWidth: true,
          onClose: () => setShowUpsertUser(false),
        }}
        isLoading={upsertUserMutation.isLoading}
        isSuccess={upsertUserMutation.isSuccess}
        error={upsertUserMutation.error}
        isEdit={user !== undefined}
      />
      <Container maxWidth={'xl'}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Stack
              direction="row"
              alignItems="center"
              alignContent="center"
              justifyContent="space-between"
            >
              {user ? (
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
                          id="user.name.variable"
                          defaultMessage="User: {username}"
                          values={{
                            username: user.username,
                          }}
                        />
                      ),
                      uri: `/u/${user.username}`,
                    },
                    {
                      caption: (
                        <FormattedMessage
                          id="edit.user"
                          defaultMessage="Edit user"
                        />
                      ),
                      uri: `/u/${user.username}/edit`,
                    },
                  ]}
                />
              ) : (
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
                          id="create.user.profile"
                          defaultMessage="Create user profile"
                        />
                      ),
                      uri: '/u/create',
                    },
                  ]}
                />
              )}
            </Stack>
          </Grid>

          <Grid item xs={12} sm={12}>
            <Stack direction={'row'} justifyContent={'space-between'}>
              {!isMobile && (
                <Typography variant="h5">
                  {user ? (
                    <FormattedMessage
                      id="edit.user.profile"
                      defaultMessage="Edit user profile: {username}"
                      values={{
                        username: user.username,
                      }}
                    />
                  ) : (
                    <FormattedMessage
                      id="create.user.profile"
                      defaultMessage="Create user profile"
                    />
                  )}
                </Typography>
              )}

              {isMobile && (
                <Button
                  onClick={() => setIsMenuOpen(true)}
                  size="small"
                  variant="outlined"
                >
                  <FormattedMessage id="menu" defaultMessage="Menu" />
                </Button>
              )}
            </Stack>
          </Grid>
          <Grid item xs={12} sm={2}>
            {!isMobile && renderMenu()}
          </Grid>
          <Grid item xs={12} sm={10}>
            <Stack spacing={2}>
              {activeMenu === ActiveMenu.General && user && (
                <>
                  <Typography variant="h5">
                    <FormattedMessage
                      id={'general'}
                      defaultMessage={'General'}
                    />
                  </Typography>
                  <UserGeneralForm
                    initialValues={user}
                    onSubmit={(val) => {
                      setUserForm(val);
                      setShowConfirmUpsertUser(true);
                    }}
                  />
                </>
              )}
              {activeMenu === ActiveMenu.Accounts && user && (
                <UserAccounts accounts={user.accounts} />
              )}
              {activeMenu === ActiveMenu.Socials && user && <UserSocials />}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
