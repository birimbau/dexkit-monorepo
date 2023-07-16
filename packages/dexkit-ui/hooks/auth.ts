import { useMutation, useQuery } from "@tanstack/react-query";
import { useWeb3React } from "@web3-react/core";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getUserByAccount } from "../modules/user/services";
import { getRefreshAccessToken, logoutApp, setAccessToken } from "../services/auth";


export function useAuth() {
  const { setIsLoggedIn, isLoggedIn, user, setUser } = useContext(AuthContext);
  return { setIsLoggedIn, isLoggedIn, user }
}


export function useLogoutAccountMutation() {
  const { account } = useWeb3React();

  const { setIsLoggedIn } = useAuth();

  return useMutation(async () => {
    if (!account) {
      return;
    }
    const accessTk = await getRefreshAccessToken();
    if (accessTk) {
      const logoutResponse = await logoutApp({ accessTk });
      const data = logoutResponse.data;
      if (data.logout) {
        if (setIsLoggedIn) {
          setIsLoggedIn(true);
        }
        setAccessToken(undefined)
      }
      return data.logout;
    }
    throw Error('not able to logout')
  })
}

export const GET_AUTH_USER = 'GET_AUTH_USER';
export function useAuthUserQuery() {
  const { account } = useWeb3React();
  return useQuery([GET_AUTH_USER, account], async () => {
    const userRequest = await getUserByAccount();
    return userRequest.data;
  })
}
