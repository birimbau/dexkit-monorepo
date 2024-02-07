import axios from 'axios';
import { DEXKIT_BASE_API_URL } from '../constants';
import { AccountFile } from '../types/file';
import { getAccessToken } from './auth';

//const MY_APPS_ENDPOINT = 'https://dexkitapi-8oo4v.ondigitalocean.app';
//const MY_APPS_ENDPOINT = 'http://localhost:3000/account-file';
//*const MY_APPS_ENDPOINT = 'https://goldfish-app-lh5o5.ondigitalocean.app/account-file'
const MY_APPS_ENDPOINT = `${DEXKIT_BASE_API_URL}/account-file`;


//const MY_APPS_ENDPOINT = 'https://squid-app-xzo63.ondigitalocean.app';

/**
 * send config to server
 * @param formData
 * @returns
 */

const myAppsApi = axios.create({ baseURL: MY_APPS_ENDPOINT, headers: { 'content-type': 'application/json' } });

myAppsApi.interceptors.request.use(async (config) => {
  const access_token = await getAccessToken()
  if (access_token)
    config.headers = {
      ...config.headers,
      authorization: `Bearer ${access_token}`
    }
  return config;

});


export async function uploadAccountFile(formData: FormData, onProgressCalback: any) {
  return await myAppsApi.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: onProgressCalback

  });
};



export async function getFilesByOwner(owner: string, take = 20, skip = 0, search?: string, sort?: string[]) {
  return await myAppsApi.get<{ files: AccountFile[], total: number, skip: number, take: number }>(`/by-owner/${owner}`, { params: { skip, take, search, sort } });
};

export async function deleteAccountFile(id: number) {
  return await myAppsApi.delete<AccountFile>(`/${id}`);
};


export async function editAccountFile(id: number, newFileName: string) {
  return await myAppsApi.post<AccountFile>(`/edit/${id}`, {
    name: newFileName,
  });
};


