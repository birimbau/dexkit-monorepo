import { useWeb3React } from '@web3-react/core';
import { ReactNode, useEffect, useState } from 'react';
import { AuthContext } from '../contexts';
import { useLoginAccountMutation } from '../hooks/account';
import { getAccessToken } from '../services/auth';

interface Props {
  children: ReactNode;
}

export function AuthProvider(props: Props) {
  // const { account } = useWeb3React();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const loginMutation = useLoginAccountMutation();
  const { children } = props;

  /*useEffect(() => {
    if (account && !isLoggedIn) {
      loginMutation.mutateAsync().then(() => setIsLoggedIn(true));
    }
  }, [account, isLoggedIn]);

  useEffect(() => {
    if (account) {
      getAccessToken().then((accessToken) => {
        if (accessToken) {
          setIsLoggedIn(true);
        }
      });
    }
  }, [account]);*/

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}
