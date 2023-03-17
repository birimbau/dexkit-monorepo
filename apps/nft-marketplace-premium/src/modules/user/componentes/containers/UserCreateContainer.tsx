import {
  Container,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import AppConfirmDialog from 'src/components/AppConfirmDialog';
import { PageHeader } from 'src/components/PageHeader';
import { useUpsertUserMutation } from '../../hooks';
import { UserOptions } from '../../types';
import UpsertUserDialog from '../dialogs/UpsertuserDialog';
import UserGeneralForm from '../forms/UserGeneralForm';

export function UserCreateContainer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [userForm, setUserForm] = useState<UserOptions>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  return (
    <>
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
        username={userForm?.username}
        isEdit={false}
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
            </Stack>
          </Grid>

          <Grid item xs={12} sm={12}>
            <Stack direction={'row'} justifyContent={'space-between'}>
              <Typography variant="h5">
                <FormattedMessage
                  id="create.user.profile"
                  defaultMessage="Create user profile"
                />
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={12}>
            <Stack spacing={2}>
              <UserGeneralForm
                onSubmit={(val) => {
                  setUserForm(val);
                  setShowConfirmUpsertUser(true);
                }}
              />
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
