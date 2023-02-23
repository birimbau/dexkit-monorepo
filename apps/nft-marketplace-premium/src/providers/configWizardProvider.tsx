import { ReactNode, useState } from 'react';
import { AppWizardConfigContext } from '../contexts';
import defaultAppConfig from '../../config/app.json';
import { AppConfig } from '../types/config';

interface Props {
  children: ReactNode;
}

export function ConfigWizardProvider(props: Props) {
  const [wizardConfig, setWizardConfig] = useState(
    defaultAppConfig as AppConfig
  );

  const { children } = props;

  return (
    <AppWizardConfigContext.Provider value={{ wizardConfig, setWizardConfig }}>
      {children}
    </AppWizardConfigContext.Provider>
  );
}
