import axios from 'axios';

let access_token: string | undefined;
let refreshedWasCalled = false;

export function getAccessToken() {
  if (access_token) {
    return access_token;
  }

}

export function setAccessToken(token: string | undefined) {
  access_token = token;
}

export async function getAccessTokenAndRefresh() {
  if (access_token) {
    return access_token;
  }
  if (!access_token && !refreshedWasCalled) {
    try {
      const response = await axios.get('/api/dex-auth/refresh-token', { withCredentials: true });
      refreshedWasCalled = false;
      access_token = response.data.access_token;
      return access_token;
    } catch (error) {
      access_token = undefined;
      refreshedWasCalled = true;
      return access_token;
    }
  }
}

/**
 * We refresh here the access token, this is called on 401 error
 * @returns 
 */
export async function getRefreshAccessToken() {
  try {
    const response = await axios.get('/api/dex-auth/refresh-token', { withCredentials: true });
    access_token = response.data.access_token;
    return access_token;
  } catch (error) {
    await axios.get('/api/dex-auth/logout', { withCredentials: true });
    access_token = undefined;
    return access_token;
  }
}

/**
 * Api route that logouts in DexKit backend
 * @param param0 
 * @returns 
 */

export async function logoutApp({ accessTk }: { accessTk: string }) {
  return axios.get<{ logout: boolean }>('/api/dex-auth/logout', {
    headers: {
      'Authorization': `Bearer ${accessTk}`
    }
  });
}