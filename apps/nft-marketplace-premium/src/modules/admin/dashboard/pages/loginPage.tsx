import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import * as React from 'react';
import { useState } from 'react';
import { useLogin, useNotify, Notification } from 'react-admin';
import { FormattedMessage } from 'react-intl';
import ConnectWalletDialog from 'src/components/dialogs/ConnectWalletDialog';
import { useLoginAccountMutation } from 'src/hooks/account';
import { useConnectWalletDialog } from 'src/hooks/app';

const MyLoginPage = () => {
  const { account } = useWeb3React();
  const login = useLogin();
  const notify = useNotify();
  const loginMutation = useLoginAccountMutation();
  const connectWalletDialog = useConnectWalletDialog();

  const handleLoginMutation = async () => {
    await loginMutation.mutateAsync();
    login({});
  };

  const handleCloseConnectWalletDialog = () => {
    connectWalletDialog.setOpen(false);
  };

  const handleConnectWallet = () => {
    connectWalletDialog.setOpen(true);
  };

  return (
    <Container maxWidth="xs">
      <ConnectWalletDialog
        dialogProps={{
          open: connectWalletDialog.isOpen,
          onClose: handleCloseConnectWalletDialog,
          fullWidth: true,
          maxWidth: 'sm',
        }}
      />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {!account && (
          <Button variant={'contained'} onClick={handleConnectWallet}>
            <FormattedMessage
              defaultMessage={'Connect Wallet'}
              id={'connect.wallet'}
            ></FormattedMessage>
          </Button>
        )}
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
