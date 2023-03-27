import { useMutation, useQuery } from '@tanstack/react-query';
import { useWeb3React } from "@web3-react/core";
import { useContext } from "react";
import { MIN_KIT_HOLDING_AI_GENERATION, WHITELISTED_AI_ACCOUNTS } from "src/constants";
import { getKitBalanceOfThreshold } from "src/services/balances";
import { AuthContext } from "../contexts";
import { loginApp, requestSignature, setAccessToken } from "../services/auth";

export function useAuth() {
  const { setIsLoggedIn, isLoggedIn } = useContext(AuthContext);
  return { setIsLoggedIn, isLoggedIn }
}



export function useLoginAccountMutation() {
  const { account, provider } = useWeb3React();
  const { setIsLoggedIn } = useAuth();

  return useMutation(async () => {
    if (!account || !provider) {
      return;
    }
    const messageToSign = await requestSignature({ address: account });

    const signature = await provider.getSigner().signMessage(messageToSign.data);

    const loginResponse = await loginApp({ signature, address: account });
    if (setIsLoggedIn) {
      setIsLoggedIn(true);
    }
    setAccessToken(loginResponse.data.access_token)
    return loginResponse.data;
  })
}

export function useIsLoggedIn() {




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