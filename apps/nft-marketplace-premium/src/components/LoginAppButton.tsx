import { useAuthUserQuery } from '@/modules/user/hooks';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Button } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useWeb3React } from '@web3-react/core';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useAuth, useLoginAccountMutation } from 'src/hooks/account';
import { useConnectWalletDialog } from 'src/hooks/app';
import Wallet from './icons/Wallet';
interface Props {
  onLogin?: () => void;
}

export function LoginAppButton({ onLogin }: Props) {
  const { account, isActive } = useWeb3React();
  const userQuery = useAuthUserQuery();
  const { user } = useAuth();
  const connectWalletDialog = useConnectWalletDialog();
  const loginMutation = useLoginAccountMutation();
  const handleOpenConnectWalletDialog = () => {
    connectWalletDialog.setOpen(true);
  };
  const handleLogin = async () => {
    await loginMutation.mutateAsync();
    userQuery.refetch();
    if (onLogin) {
      onLogin();
    }
  };

  const isSameUserAccount = useMemo(() => {
    if (!account?.toLowerCase()) {
      return false;
    }

    if (account?.toLowerCase() === user?.address?.toLowerCase()) {
      return true;
    }
    return false;
  }, [user, account]);

  const buttonMsg = () => {
    if (isSameUserAccount) {
      return <FormattedMessage id={'logged'} defaultMessage={'Logged'} />;
    }
    if (loginMutation.isLoading) {
      return (
        <FormattedMessage id={'sign.message'} defaultMessage={'sign message'} />
      );
    }
    return <FormattedMessage id={'login'} defaultMessage={'Login'} />;
  };

  if (!account || !isActive) {
    return (
      <Button
        variant="outlined"
        color="inherit"
        onClick={handleOpenConnectWalletDialog}
        startIcon={<Wallet />}
        endIcon={<ChevronRightIcon />}
      >
        <FormattedMessage
          id="connect.wallet"
          defaultMessage="Connect Wallet"
          description="Connect wallet button"
        />
      </Button>
    );
  }

  return (
    <>
      <Button
        variant={'contained'}
        disabled={loginMutation.isLoading || isSameUserAccount}
        startIcon={loginMutation.isLoading && <CircularProgress />}
        onClick={handleLogin}
      >
        {buttonMsg()}
      </Button>
    </>
  );
}
