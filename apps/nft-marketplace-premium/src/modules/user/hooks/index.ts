import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useWeb3React } from '@web3-react/core';
import { useAuth, useLoginAccountMutation } from 'src/hooks/account';
import { getUserAddAccountMessage, getUserByAccount, getUserByUsername, getUserConnectDiscord, getUserConnectTwitter, postUserAddAccount, upsertUser } from '../services';
import { UserOptions } from '../types';



export function useAddAccounttUserMutation() {
  const { account, provider } = useWeb3React();
  const { isLoggedIn } = useAuth()
  const queryClient = useQueryClient();
  return useMutation(async () => {
    if (!provider || !account) {
      return;
    }
    if (!isLoggedIn) {
      return
    }
    const messageToSign = await getUserAddAccountMessage({ address: account });

    const signature = await provider.getSigner().signMessage(messageToSign.data);


    const user = await postUserAddAccount({ signature, address: account })
    queryClient.refetchQueries([GET_AUTH_USER])
    return user;

  })
}


export function useUpsertUserMutation() {
  const { isLoggedIn } = useAuth()
  const loginMutation = useLoginAccountMutation()
  return useMutation(async (user?: UserOptions) => {
    if (!user) {
      return;
    }
    if (!isLoggedIn) {
      await loginMutation.mutateAsync()
    }
    await upsertUser(user);
  })
}

export function useUserConnectTwitterMutation() {
  const { isLoggedIn } = useAuth()
  const loginMutation = useLoginAccountMutation()
  return useMutation(async () => {

    if (!isLoggedIn) {
      await loginMutation.mutateAsync()
    }

    await getUserConnectTwitter();
  })
}


export function useUserConnectDiscordMutation() {
  const { isLoggedIn } = useAuth()
  const loginMutation = useLoginAccountMutation()
  return useMutation(async () => {

    if (!isLoggedIn) {
      await loginMutation.mutateAsync()
    }
    await getUserConnectDiscord();
  })
}

export const GET_USER_BY_USERNAME_QUERY = 'GET_USER_BY_USERNAME_QUERY';

export function useUserQuery(username?: string) {
  return useQuery([GET_USER_BY_USERNAME_QUERY, username], async () => {
    if (username) {
      const userRequest = await getUserByUsername(username);
      return userRequest.data;
    }
    return null
  })
}

export const GET_AUTH_USER = 'GET_AUTH_USER';
export function useAuthUserQuery() {

  return useQuery([GET_AUTH_USER], async () => {
    const userRequest = await getUserByAccount();
    return userRequest.data;
  })
}