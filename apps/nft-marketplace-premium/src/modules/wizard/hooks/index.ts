import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useContext, useMemo } from 'react';
import { AppWizardConfigContext } from '../../../contexts';

import { ChainId } from '@dexkit/core';
import { NETWORKS } from '@dexkit/core/constants/networks';
import { NFTDrop } from '@thirdweb-dev/sdk';
import { ethers } from 'ethers';
import { QUERY_ADMIN_WHITELABEL_CONFIG_NAME } from 'src/hooks/whitelabel';
import { getAccessToken } from 'src/services/auth';
import { myAppsApi } from 'src/services/whitelabel';
import { AppConfig } from 'src/types/config';
import {
  addPermissionsMemberSite,
  checkGatedConditions,
  deleteAppVersion,
  deleteMemberSite,
  getTokenList,
  requestEmailConfirmatioForSite,
  setAppVersion,
  upsertAppVersion
} from '../services';
import { GatedCondition } from '../types';
import { generateCSSVarsTheme } from '../utils';

export const TOKEN_LIST_URL = 'TOKEN_LIST_URL';

export function useTokenListUrl(url?: string) {
  return useQuery([TOKEN_LIST_URL, url], async () => {
    if (!url) {
      return;
    }

    return await getTokenList(url);
  });
}

export function useAppWizardConfig() {
  const { wizardConfig, setWizardConfig } = useContext(AppWizardConfigContext);
  return { wizardConfig, setWizardConfig };
}

export function usePreviewThemeFromConfig({
  appConfig,
}: {
  appConfig?: AppConfig;
}) {
  const customThemeDark = useMemo(() => {
    if (appConfig?.customThemeDark) {
      return JSON.parse(appConfig?.customThemeDark);
    }
    return {};
  }, [appConfig?.customThemeDark]);

  const customThemeLight = useMemo(() => {
    if (appConfig?.customThemeLight) {
      return JSON.parse(appConfig?.customThemeLight);
    }
    return {};
  }, [appConfig?.customThemeLight]);
  const selectedTheme = useMemo(() => {
    return generateCSSVarsTheme({
      selectedFont: appConfig?.font,
      cssVarPrefix: 'theme-preview',
      customTheme: {
        colorSchemes: {
          dark: {
            ...customThemeDark,
          },
          light: {
            ...customThemeLight,
          },
        },
      },

      selectedThemeId: appConfig?.theme as string,
      mode: appConfig?.defaultThemeMode,
    });
  }, [
    customThemeDark,
    customThemeLight,
    appConfig?.theme,
    appConfig?.defaultThemeMode,
    appConfig?.font,
  ]);

  return selectedTheme;
}

export function useCheckGatedConditions({
  conditions,
  account,
}: {
  conditions?: GatedCondition[];
  account?: string;
}) {
  return useQuery(['GET_CHECKED_GATED_CONDITIONS', account, conditions], () => {
    if (!conditions) {
      return;
    }

    return checkGatedConditions({ account, conditions });
  });
}
export const JSON_RPC_PROVIDER = 'JSON_RPC_PROVIDER';

export function useJsonRpcProvider({ chainId }: { chainId: ChainId }) {
  return useQuery([JSON_RPC_PROVIDER, chainId], () => {
    if (chainId) {
      return new ethers.providers.JsonRpcProvider(
        NETWORKS[chainId].providerRpcUrl,
      );
    }
  });
}

export function useSendSiteConfirmationLinkMutation() {
  return useMutation(async ({ siteId }: { siteId?: number }) => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error('Need access token');
    }
    if (!siteId) {
      throw new Error('Need to pass site id');
    }
    return await requestEmailConfirmatioForSite({ siteId, accessToken });
  });
}

export function useClaimNft({ contract }: { contract?: NFTDrop }) {
  return useMutation(async ({ quantity }: { quantity: number }) => {
    return await contract?.erc721.claim.prepare(quantity);
  });
}


export function useAddPermissionMemberMutation() {

  const query = useQueryClient()

  return useMutation(async ({ siteId, permissions, account }: { siteId?: number, permissions?: string, account?: string }) => {
    if (!siteId || !permissions || !account) {
      throw Error('missing data to update')
    }

    await addPermissionsMemberSite({ siteId, permissions, account });
    query.refetchQueries([QUERY_ADMIN_WHITELABEL_CONFIG_NAME])

    return true
  });
}

export function useDeleteMemberMutation() {

  const query = useQueryClient()

  return useMutation(async ({ siteId, account }: { siteId?: number, account?: string }) => {
    if (!siteId || !account) {
      throw Error('missing data to update')
    }
    await deleteMemberSite({ siteId, account });
    query.refetchQueries([QUERY_ADMIN_WHITELABEL_CONFIG_NAME])
    return true
  });
}

export function useAddAppVersionMutation() {

  const query = useQueryClient()

  return useMutation(async ({ siteId, version, description, versionId }: { siteId?: number, version?: string, description?: string, versionId?: number }) => {

    if (!siteId || !version) {
      throw Error('missing data to update')
    }

    await upsertAppVersion({ siteId, version, description, versionId });
    query.refetchQueries([GET_APP_VERSIONS_QUERY])
    if (versionId) {
      query.refetchQueries([QUERY_ADMIN_WHITELABEL_CONFIG_NAME])
    }

    return true
  });
}

export function useDeleteAppVersionMutation() {

  const query = useQueryClient()

  return useMutation(async ({ siteId, siteVersionId }: { siteId?: number, siteVersionId?: number }) => {
    if (!siteId || !siteVersionId) {
      throw Error('missing data to update')
    }
    await deleteAppVersion({ siteId, siteVersionId });
    query.refetchQueries([GET_APP_VERSIONS_QUERY])
    return true
  });
}

export function useSetAppVersionMutation() {

  const query = useQueryClient()

  return useMutation(async ({ siteId, siteVersionId }: { siteId?: number, siteVersionId?: number }) => {
    if (!siteId || !siteVersionId) {
      throw Error('missing data to update')
    }
    await setAppVersion({ siteId, siteVersionId });
    query.refetchQueries([QUERY_ADMIN_WHITELABEL_CONFIG_NAME])
    return true
  });
}



export const GET_APP_VERSIONS_QUERY = 'GET_APP_VERSIONS_QUERY'

export function useAppVersionListQuery({
  siteId,
  page = 0,
  pageSize = 10,
  sort,

  filter,
}: {

  page?: number;
  pageSize?: number;
  siteId?: number;
  sort?: string[];
  filter?: any;
}) {

  return useQuery<{
    data: {
      id: number;
      version: string;
      description: string;
    }[];
    skip?: number;
    take?: number;
    total?: number;
  }>(
    [GET_APP_VERSIONS_QUERY, sort, page, pageSize, filter, siteId],
    async () => {
      if (!siteId) {
        return { data: [] };
      }


      return (
        await myAppsApi.get<{
          data: {
            id: number;
            version: string;
            description: string;
          }[];
          skip?: number;
          take?: number;
          total?: number;
        }>(`/site/versions/all/${siteId}`, {
          params: { skip: page * pageSize, take: pageSize, sort, filter: filter ? JSON.stringify(filter) : undefined },
        })
      ).data;

    }
  );
}

export const GET_APP_VERSION_QUERY = 'GET_APP_VERSION_QUERY'

export function useAppVersionQuery({
  siteId,
  appVersionId,
}: {

  siteId: number,
  appVersionId: number;
}) {

  return useQuery<{
    config: string
  }>(
    [GET_APP_VERSION_QUERY, appVersionId, siteId],
    async () => {
      if (!siteId || !appVersionId) {
        return { config: '' };
      }
      return (
        await myAppsApi.get<{
          config: string
        }>(`/site/single-version/${siteId}/${appVersionId}`)
      ).data;

    }
  );
}


