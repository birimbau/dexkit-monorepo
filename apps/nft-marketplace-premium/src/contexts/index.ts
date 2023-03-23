import React, { Dispatch, SetStateAction } from 'react';
import { AppConfig } from '../types/config';

import { AssetAPI } from 'src/types/nft';
import defaultAppConfig from '../../config/app.json';

export const AppConfigContext = React.createContext<{ appConfig: AppConfig, appNFT?: AssetAPI }>({
  appConfig: defaultAppConfig as AppConfig
}
);

interface IAppWizardConfigContext {
  wizardConfig: AppConfig;
  setWizardConfig?: any
}

export const AppWizardConfigContext = React.createContext<IAppWizardConfigContext>({
  wizardConfig:
    defaultAppConfig as AppConfig
});

interface IAuthContext {
  isLoggedIn: boolean;
  setIsLoggedIn?: Dispatch<SetStateAction<boolean>>
}

const AUTH_INITIAL_VALUES = {
  isLoggedIn: false,
  setIsLoggedIn: undefined
}


export const AuthContext = React.createContext<IAuthContext>(AUTH_INITIAL_VALUES);