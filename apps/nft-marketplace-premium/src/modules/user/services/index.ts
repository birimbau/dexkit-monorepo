import { myAppsApi } from 'src/services/whitelabel';
import { UserOptions } from '../types';



export function getUsernameExists(username?: string) {

  return myAppsApi.get(`/user/username-exists/${username}`)

}

export function getUserByUsername(username?: string) {

  return myAppsApi.get<UserOptions & { accounts: { address: string }[] }>(`/user/username/${username}`)

}

export function upsertUser(user: UserOptions) {
  return myAppsApi.post(`/user/upsert`, user)
}

export function getUserConnectTwitter() {
  return myAppsApi.get(`/auth/twitter`)
}

export function getUserConnectDiscord() {
  return myAppsApi.get(`/auth/discord`)
}