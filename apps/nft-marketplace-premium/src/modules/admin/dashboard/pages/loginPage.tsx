import { useLoginAccountMutation } from '@dexkit/ui/hooks/auth';
import { useWeb3React } from '@dexkit/ui/hooks/thirdweb';
import { createThirdwebClient } from 'thirdweb';

import { THIRDWEB_CLIENT_ID } from '@dexkit/ui/constants/thirdweb';
import { Box, Button, Container } from '@mui/material';
import { useLogin } from 'react-admin';
import { FormattedMessage } from 'react-intl';
import { ConnectButton } from 'thirdweb/react';

const client = createThirdwebClient({ clientId: THIRDWEB_CLIENT_ID });

const MyLoginPage = () => {
  const { account } = useWeb3React();
  const login = useLogin();
  const loginMutation = useLoginAccountMutation();

  const handleLoginMutation = async () => {
    await loginMutation.mutateAsync();
    login({});
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {!account && <ConnectButton client={client} />}
        {account && (
          <Button variant={'contained'} onClick={handleLoginMutation}>
            <FormattedMessage
              defaultMessage={'Login'}
              id={'login'}
            ></FormattedMessage>
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default MyLoginPage;
