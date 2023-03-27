import { useWeb3React } from '@web3-react/core';
import { ReactNode, useEffect, useState } from 'react';
import { AuthContext } from '../contexts';
import { useLoginAccountMutation } from '../hooks/account';
import { getAccessTokenAndRefresh } from '../services/auth';

interface Props {
  children: ReactNode;
}

export function AuthProvider(props: Props) {
  const { account } = useWeb3React();
  const [triedLogin, setTriedLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const loginMutation = useLoginAccountMutation();
  const { children } = props;

  useEffect(() => {
    if (account && !isLoggedIn && triedLogin) {
      loginMutation.mutateAsync().then(() => setIsLoggedIn(true));
    }
  }, [account, isLoggedIn, triedLogin]);

  useEffect(() => {
    if (account) {
      getAccessTokenAndRefresh()
        .then((accessToken) => {
          if (accessToken) {
            setIsLoggedIn(true);
          }
        })
        .finally(() => setTriedLogin(true));
    }
  }, [account]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}
