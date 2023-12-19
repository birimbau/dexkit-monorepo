import { useDexKitContext } from '@dexkit/ui';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useWeb3React } from "@web3-react/core";
import jwt_decode from 'jwt-decode';
import { useContext } from "react";
import { MIN_KIT_HOLDING_AI_GENERATION, WHITELISTED_AI_ACCOUNTS } from "src/constants";
import { getKitBalanceOfThreshold } from "src/services/balances";
import { AuthContext } from "../contexts";
import { getRefreshAccessToken, loginApp, logoutApp, requestSignature, setAccessToken } from "../services/auth";
import { useSignMessageDialog } from './app';

export function useAuth() {
  const { setIsLoggedIn, isLoggedIn, user, setUser } = useContext(AuthContext);
  return { setIsLoggedIn, isLoggedIn, user, setUser }
}



export function useLoginAccountMutation() {
  const { account, provider } = useWeb3React();
  const signMessageDialog = useSignMessageDialog();
  const { siteId, affiliateReferral } = useDexKitContext();

  const { setIsLoggedIn, setUser } = useAuth();

  return useMutation(async () => {
    if (!account || !provider) {
      return;
    }
    signMessageDialog.setOpen(true)
    const messageToSign = await requestSignature({ address: account });

    const signature = await provider.getSigner().signMessage(messageToSign.data);

    const loginResponse = await loginApp({ signature, address: account, siteId, referral: affiliateReferral });
    if (setIsLoggedIn) {
      setIsLoggedIn(true);
    }

    if (setUser && loginResponse.data.access_token) {
      setUser(jwt_decode(loginResponse.data.access_token))
    }
    setAccessToken(loginResponse.data.access_token)

    return loginResponse.data;
  }, {
    onError(error) {
      signMessageDialog.setOpen(false)
      // signMessageDialog.setError(Error('Error signing message'));
    },
    onSettled() {
      signMessageDialog.setOpen(false)
    }
  })
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
          setIsLoggedIn(false);
        }
        setAccessToken(undefined)
      }
      return data.logout;
    }
    throw Error('not able to logout')
  })
}


export function useAccountHoldDexkitMutation() {
  const { account } = useWeb3React();

  return useMutation(async () => {
    if (!account) {
      return;
    }
    if (WHITELISTED_AI_ACCOUNTS.map(a => a.toLowerCase()).includes(account.toLowerCase())) {
      return true;
    }
    const minHolding = MIN_KIT_HOLDING_AI_GENERATION;
    const hasKit = await getKitBalanceOfThreshold(account, minHolding)
    if (hasKit === 0) {
      throw new Error(`You need to hold more than ${minHolding} KIT in at least one of supported networks: ETH, BSC or Polygon`)
    }
  })
}

export function useAccountHoldDexkitQuery() {
  const { account } = useWeb3React();

  return useQuery([account], async () => {
    if (!account) {
      return;
    }
    if (WHITELISTED_AI_ACCOUNTS.map(a => a.toLowerCase()).includes(account.toLowerCase())) {
      return true;
    }


    const minHolding = MIN_KIT_HOLDING_AI_GENERATION;
    const hasKit = await getKitBalanceOfThreshold(account, minHolding)
    return hasKit > 0;
  })
}