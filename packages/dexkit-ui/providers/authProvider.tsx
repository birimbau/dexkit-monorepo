import { useLoginAccountMutation } from "@dexkit/ui/hooks/auth";
import {
    getAccessToken,
    getAccessTokenAndRefresh,
} from "@dexkit/ui/services/auth";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import jwt_decode from "jwt-decode";
import { ReactNode, useContext, useEffect, useState } from "react";
import { AuthContext, AuthStateContext } from "../context/AuthContext";

interface Props {
  children: ReactNode;
}

export function AuthProvider(props: Props) {
  const { account } = useWeb3React();
  const [triedLogin, setTriedLogin] = useState(false);
  const { isLoggedIn, setIsLoggedIn, user, setUser } =
    useContext(AuthStateContext);

  const loginMutation = useLoginAccountMutation();
  const { children } = props;

  useEffect(() => {
    if (account && !isLoggedIn && triedLogin && setIsLoggedIn && setUser) {
      loginMutation.mutateAsync().then((d) => {
        setIsLoggedIn(true);
        if (d?.access_token) {
          setUser(jwt_decode(d?.access_token));
        }
      });
    }
  }, [account, isLoggedIn, triedLogin, setIsLoggedIn, setUser]);

  useEffect(() => {
    if (setUser) {
      if (isLoggedIn) {
        const accessToken = getAccessToken();
        if (accessToken) {
          setUser(jwt_decode(accessToken));
        }
      } else {
        setUser(undefined);
      }
    }
  }, [isLoggedIn, setUser]);

  useEffect(() => {
    if (account && setIsLoggedIn && setUser) {
      getAccessTokenAndRefresh()
        .then((accessToken) => {
          if (accessToken) {
            setUser(jwt_decode(accessToken));
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
        })
        .finally(() => setTriedLogin(true));
    }
  }, [account]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
