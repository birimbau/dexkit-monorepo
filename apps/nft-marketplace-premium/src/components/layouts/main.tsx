import {
  Box,
  Button,
  NoSsr,
  Stack,
  Typography,
  useColorScheme,
} from '@mui/material';

import { useAtom } from 'jotai';
import dynamic from 'next/dynamic';
import React, { useEffect, useMemo } from 'react';
import { useAppConfig, useAppNFT, useThemeMode } from '../../hooks/app';

import { drawerIsOpenAtom } from '../../state/atoms';

const AppDrawer = dynamic(() => import('../AppDrawer'));

import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import { ErrorBoundary } from 'react-error-boundary';
import { FormattedMessage } from 'react-intl';
import { Footer } from '../Footer';
import Navbar from '../Navbar';
import { GlobalDialogs } from './GlobalDialogs';

interface Props {
  children?: React.ReactNode | React.ReactNode[];
  noSsr?: boolean;
  disablePadding?: boolean;
  appConfigProps?: AppConfig;
  isPreview?: boolean;
}

const MainLayout: React.FC<Props> = ({
  children,
  noSsr,
  disablePadding,
  appConfigProps,
  isPreview,
}) => {
  const { mode } = useThemeMode();
  const { setMode } = useColorScheme();

  const defaultAppConfig = useAppConfig();
  const appNFT = useAppNFT();
  const appConfig = useMemo(() => {
    if (appConfigProps) {
      return appConfigProps;
    } else {
      return defaultAppConfig;
    }
  }, [defaultAppConfig, appConfigProps]);

  //NOTE: NOT remove this, this syncs MUI internal theme with APP theme
  useEffect(() => {
    setMode(mode);
  }, [mode]);

  const [isDrawerOpen, setIsDrawerOpen] = useAtom(drawerIsOpenAtom);

  const handleCloseDrawer = () => setIsDrawerOpen(false);

  const render = () => (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <Stack justifyContent="center" alignItems="center">
          <Typography variant="h6">
            <FormattedMessage
              id="something.went.wrong"
              defaultMessage="Oops, something went wrong"
              description="Something went wrong error message"
            />
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {String(error)}
          </Typography>
          <Button color="primary" onClick={resetErrorBoundary}>
            <FormattedMessage
              id="try.again"
              defaultMessage="Try again"
              description="Try again"
            />
          </Button>
        </Stack>
      )}
    >
      {isDrawerOpen && (
        <AppDrawer open={isDrawerOpen} onClose={handleCloseDrawer} />
      )}
      <GlobalDialogs />

      <Box
        style={{
          minHeight: '100vh',
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Navbar appConfig={appConfig} isPreview={isPreview} />
        <Box sx={{ flex: 1 }} py={disablePadding ? 0 : 4}>
          <ErrorBoundary
            fallbackRender={({ error, resetErrorBoundary }) => (
              <Stack justifyContent="center" alignItems="center">
                <Typography variant="h6">
                  <FormattedMessage
                    id="something.went.wrong"
                    defaultMessage="Oops, something went wrong"
                    description="Something went wrong error message"
                  />
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {String(error)}
                </Typography>
                <Button color="primary" onClick={resetErrorBoundary}>
                  <FormattedMessage
                    id="try.again"
                    defaultMessage="Try again"
                    description="Try again"
                  />
                </Button>
              </Stack>
            )}
          >
            {children}
          </ErrorBoundary>
        </Box>
        <Footer appConfig={appConfig} isPreview={isPreview} appNFT={appNFT} />
      </Box>
    </ErrorBoundary>
  );

  if (noSsr) {
    return <NoSsr>{render()}</NoSsr>;
  }

  return render();
};

export default MainLayout;
