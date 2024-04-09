import {
  Box,
  Button,
  NoSsr,
  Paper,
  Stack,
  Typography,
  useColorScheme,
} from "@mui/material";

import dynamic from "next/dynamic";
import React, { useEffect, useMemo } from "react";

const AppDrawer = dynamic(() => import("../AppDrawer"));

import { AppConfig } from "@dexkit/ui/modules/wizard/types/config";
import { ErrorBoundary } from "react-error-boundary";
import { FormattedMessage } from "react-intl";
import {
  useAppConfig,
  useAppNFT,
  useDrawerIsOpen,
  useThemeMode,
} from "../../hooks";
import { Footer } from "../Footer";
import Navbar from "../Navbar";
import NavbarAlt from "../NavbarAlt";
import { GlobalDialogs } from "./GlobalDialogs";

interface Props {
  children?: React.ReactNode | React.ReactNode[];
  noSsr?: boolean;
  disablePadding?: boolean;
  appConfigProps?: AppConfig;
  isPreview?: boolean;
}

const WrapperLayout: React.FC<{
  appConfig: AppConfig;
  children?: React.ReactNode | React.ReactNode[];
}> = ({ children, appConfig }) => {
  const isDrawerOpen = useDrawerIsOpen();

  const handleCloseDrawer = () => isDrawerOpen.setIsOpen(false);

  if (appConfig.menuSettings?.layout?.type === "sidebar") {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          minHeight: "100vh",
        }}
      >
        <Paper
          sx={{ position: "relative", minHeight: "100vh" }}
          square
          variant="elevation"
        >
          <Box sx={{ position: "sticky", top: 72 }}>
            <AppDrawer
              appConfig={appConfig}
              open={isDrawerOpen.isOpen}
              onClose={handleCloseDrawer}
            />
          </Box>
        </Paper>
        <Box
          style={{
            flex: 1,
            margin: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </Box>
      </Box>
    );
  } else {
    return (
      <Box
        style={{
          minHeight: "100vh",
          margin: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </Box>
    );
  }
};

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

  const isDrawerOpen = useDrawerIsOpen();

  const handleCloseDrawer = () => isDrawerOpen.setIsOpen(false);

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
      {isDrawerOpen.isOpen && (
        <AppDrawer open={isDrawerOpen.isOpen} onClose={handleCloseDrawer} />
      )}
      <GlobalDialogs />
      <Navbar appConfig={appConfig} isPreview={isPreview} />
      <NavbarAlt appConfig={appConfig} isPreview={isPreview} />

      <WrapperLayout appConfig={appConfig}>
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

        <Box>
          <Footer appConfig={appConfig} isPreview={isPreview} appNFT={appNFT} />
        </Box>
      </WrapperLayout>
    </ErrorBoundary>
  );

  if (noSsr) {
    return <NoSsr>{render()}</NoSsr>;
  }

  return render();
};

export default MainLayout;
