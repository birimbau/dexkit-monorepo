import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuth, useLoginAccountMutation } from 'src/hooks/account';
import { getUserByUsername, getUserConnectDiscord, getUserConnectTwitter, upsertUser } from '../services';
import { UserOptions } from '../types';



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