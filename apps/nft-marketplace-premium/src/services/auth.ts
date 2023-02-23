import axios from 'axios';
import { DEXKIT_BASE_API_URL } from '../constants';





//const MY_APPS_ENDPOINT = 'https://dexkitapi-8oo4v.ondigitalocean.app';
//const AUTH_ENDPOINT = 'http://localhost:3000/auth';
//const AUTH_ENDPOINT = 'https://goldfish-app-lh5o5.ondigitalocean.app/auth'
const AUTH_ENDPOINT = `${DEXKIT_BASE_API_URL}/auth`;

//const MY_APPS_ENDPOINT = 'https://squid-app-xzo63.ondigitalocean.app';

/**
 * send config to server
 * @param formData
 * @returns
 */
const authApi = axios.create({ baseURL: AUTH_ENDPOINT, headers: { 'content-type': 'application/json' } });

export async function login({ address, signature }: { address: string, signature: string }) {
  return authApi.post<{ access_token: string }>('/login', { data: { address, signature } });
}

export async function requestSignature({ address }: { address: string }) {
  return authApi.get<string>(`/message-to-sign/${address}`);
}

let access_token: string | undefined;
let refreshedWasCalled = false;

export async function getAccessToken() {
  if (access_token) {
    return access_token;
  }
  /*if (!access_token && !refreshedWasCalled) {
    try {
      const response = await authApi.get<{ access_token: string }>("refresh-token", { withCredentials: true });

      access_token = response.data.access_token;

      return access_token;
    } catch (error) {
      access_token = undefined;
      refreshedWasCalled = true;
      return access_token;
    }
  }*/
}

export function setAccessToken(token: string | undefined) {
  access_token = token;
}