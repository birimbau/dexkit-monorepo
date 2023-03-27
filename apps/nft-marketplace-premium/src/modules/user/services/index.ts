import axios from 'axios';
import { myAppsApi } from 'src/services/whitelabel';
import { UserOptions } from '../types';



export function getUsernameExists(username?: string) {

  return myAppsApi.get(`/user/username-exists/${username}`)

}

export function getUserByUsername(username?: string) {
  return myAppsApi.get<UserOptions & { accounts: { address: string }[] }>(`/user/username/${username}`)
}
export function getUserByAccount() {
  return myAppsApi.get<UserOptions & { accounts: { address: string }[] }>(`/user/authenticated/account`)
}

export function getUserAddAccountMessage({ address }: { address: string }) {
  return myAppsApi.get<string>(`/user/message-to-sign/${address}`)
}

export function postUserAddAccount({ signature, address }: { address: string, signature: string }) {
  return myAppsApi.post<UserOptions & { accounts: { address: string }[] }>(`/user/add-account`, { signature, address })
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