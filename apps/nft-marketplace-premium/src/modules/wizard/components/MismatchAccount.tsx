import { truncateAddress } from '@dexkit/core/utils';
import { Alert, Box, Stack } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { FormattedMessage } from 'react-intl';
import { LoginButton } from 'src/components/LoginButton';
import { useAuth } from 'src/hooks/account';

export function MismatchAccount() {
  const { account } = useWeb3React();
  const { user, isLoggedIn } = useAuth();

  if (
    isLoggedIn &&
    account &&
    user &&
    account.toLowerCase() !== user.address?.toLowerCase()
  ) {
    return (
      <Box display={'flex'}>
        <Stack spacing={2} flexDirection={'row'}>
          <Alert severity="info">
            <FormattedMessage
              id={'mismatch.account.admin.view'}
              defaultMessage={
                'You are connected to {account} but logged as {loggedAccount}. If you want to see apps associated with current connected account, click on'
              }
              values={{
                account: truncateAddress(account),
                loggedAccount: truncateAddress(user.address?.toLowerCase()),
              }}
            ></FormattedMessage>
            <LoginButton />
          </Alert>
        </Stack>
      </Box>
    );
  }

  return null;
}
