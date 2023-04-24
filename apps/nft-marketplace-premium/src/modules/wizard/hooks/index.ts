import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { AppWizardConfigContext } from '../../../contexts';

import { getTokenList } from '../services';

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
