import axios from 'axios';
import { DEXKIT_BASE_API_URL } from 'src/constants';
import { getAccessToken } from 'src/services/auth';

const DEXKTI_DASH_ENDPOINT = `${DEXKIT_BASE_API_URL}`;

export const myAppsApi = axios.create({
  baseURL: DEXKTI_DASH_ENDPOINT,
  headers: { 'content-type': 'application/json' },
});

myAppsApi.interceptors.request.use(async (config) => {
  const access_token = await getAccessToken();
  if (access_token)
    config.headers = {
      ...config.headers,
      authorization: `Bearer ${access_token}`,
    };
  return config;
});

export default {
  getList: async (resource: any, params: any) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    if (resource === 'coin-platform') {
      resource = '/coin/platforms';
    }
    return (
      await myAppsApi.get(`${resource}/admin/all`, {
        params: {
          skip: (page - 1) * perPage,
          take: perPage,
          sort: field ? [field, order] : undefined,
          filter: params.filter,
        },
      })
    ).data;
  },

  getOne: async (resource: any, params: any) => {
    if (resource === 'coin-platform') {
      resource = '/coin/platforms';
    }
    const data = (await myAppsApi.get(`${resource}/admin/all/${params.id}`))
      .data;
    return {
      data,
    };
  },

  getMany: (resource: any, params: any) => {},

  getManyReference: async (resource: any, params: any) => {
    const { page, perPage } = params.pagination;
    return (
      await myAppsApi.get(`${resource}/admin/all`, {
        params: { skip: (page - 1) * perPage, take: perPage },
      })
    ).data;
  },

  create: (resource: any, params: any) => {},

  update: async (resource: any, params: any) => {
    if (resource === 'coin-platform') {
      resource = '/coin/platforms';
    }

    const data = (
      await myAppsApi.post(`${resource}/admin/all/${params.id}`, params.data)
    ).data;

    return {
      data,
    };
  },

  updateMany: (resource: any, params: any) => {},

  delete: (resource: any, params: any) => {},

  deleteMany: (resource: any, params: any) => {},
};
