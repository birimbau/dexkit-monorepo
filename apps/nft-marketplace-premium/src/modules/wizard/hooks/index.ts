import { useQuery } from '@tanstack/react-query';
import { useContext, useMemo } from 'react';
import { AppWizardConfigContext } from '../../../contexts';

import { ChainId } from '@dexkit/core';
import { NETWORKS } from '@dexkit/core/constants/networks';
import { ethers } from 'ethers';
import { useAtomValue } from 'jotai/utils';
import { AppConfig } from 'src/types/config';
import { getTokenList } from '../services';
import { customThemeDarkAtom, customThemeLightAtom } from '../state';
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
  const customThemeDark = useAtomValue(customThemeDarkAtom);
  const customThemeLight = useAtomValue(customThemeLightAtom);
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

export const JSON_RPC_PROVIDER = 'JSON_RPC_PROVIDER';

export function useJsonRpcProvider({ chainId }: { chainId: ChainId }) {
  return useQuery([JSON_RPC_PROVIDER, chainId], () => {
    if (chainId) {
      return new ethers.providers.JsonRpcProvider(
        NETWORKS[chainId].providerRpcUrl
      );
    }
  });
}
