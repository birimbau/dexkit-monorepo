import axios from 'axios';
import { DEXKIT_BASE_API_URL } from 'src/constants';
import { myAppsApi } from 'src/services/whitelabel';
import { UserOptions } from '../types';

const USER_ENDPOINT = `${DEXKIT_BASE_API_URL}/user`;
/**
 * not this endpoint is intended to use without the interceptor, we set the bearear token automatically
 */
export const userApi = axios.create({ baseURL: USER_ENDPOINT, headers: { 'content-type': 'application/json' } });

export function getUsernameExists(username?: string) {

  return myAppsApi.get(`/user/username-exists/${username}`)

}

export function getUserByUsername(username?: string) {
  return myAppsApi.get<UserOptions & { accounts: { address: string }[] }>(`/user/username/${username}`)
}


export function getUserByAccountRefresh({ token }: { token: string }) {
  return userApi.get<UserOptions & { accounts: { address: string }[] } & { credentials?: { provider: string, username: string }[] }>(`/authenticated-refresh/account`,
    {
      headers: {
        authorization: `Bearer ${token}`
      }
    })
}


export function getUserByAccount() {
  return myAppsApi.get<UserOptions & { accounts: { address: string }[] } & { credentials?: { provider: string, username: string }[] }>(`/user/authenticated/account`)
}

export function getUserAddAccountMessage({ address }: { address: string }) {
  return myAppsApi.get<string>(`/user/message-to-sign/${address}`)
}

export function postUserAddAccount({ signature, address }: { address: string, signature: string }) {
  return myAppsApi.post<UserOptions & { accounts: { address: string }[] }>(`/user/add-account`, { signature, address })
}

export function postUserRemoveAccount({ address }: { address: string }) {
  return myAppsApi.post<UserOptions & { accounts: { address: string }[] }>(`/user/remove-account`, { address })
}


export function upsertUser(user: UserOptions) {
  return myAppsApi.post(`/user/upsert`, user)
}

export function getUserConnectTwitter() {
  return axios.get(`/api/auth/twitter`)
}

export function getUserConnectDiscord() {
  return myAppsApi.get(`/auth/discord`)
}