import React from 'react';

import { AuthProvider } from '../../providers/authProvider';
import { ConfigWizardProvider } from '../../providers/configWizardProvider';
import MainLayout from './main';

interface Props {
  children?: React.ReactNode | React.ReactNode[];
  noSsr?: boolean;
  disablePadding?: boolean;
}
/**
 * Use Auth Main Layout when you need authentication feature
 * @returns
 */
const AuthMainLayout: React.FC<Props> = ({
  children,
  noSsr,
  disablePadding,
}) => {
  return (
    <ConfigWizardProvider>
      <AuthProvider>
        <MainLayout noSsr={noSsr} disablePadding={disablePadding}>
          {children}
        </MainLayout>
      </AuthProvider>
    </ConfigWizardProvider>
  );
};

export default AuthMainLayout;
