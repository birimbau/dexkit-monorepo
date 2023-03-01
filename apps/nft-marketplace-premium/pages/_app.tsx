import { CacheProvider, EmotionCache } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { responsiveFontSizes, ThemeProvider } from '@mui/material/styles';
import {
  DehydratedState,
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { AppProps } from 'next/app';
import Head from 'next/head';
import * as React from 'react';
import createEmotionCache from '../src/createEmotionCache';
import { getTheme } from '../src/theme';

import { DefaultSeo } from 'next-seo';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

import { Web3ReactProvider } from '@web3-react/core';
import { Provider } from 'jotai';
import { hooks as metaMaskHooks, metaMask } from '../src/connectors/metamask';
import {
  hooks as walletConnectHooks,
  walletConnect,
} from '../src/connectors/walletConnect';

import { useRouter } from 'next/router';
import { SnackbarProvider } from 'notistack';
import AppIntlProvider from '../src/components/AppIntlProvider';
import { Updater } from '../src/components/transactions/Updater';

import { Backdrop, CircularProgress, createTheme } from '@mui/material';
import defaultAppConfig from '../config/app.json';

import { AppConfigContext } from '../src/contexts';
import { AppConfig } from '../src/types/config';
import './customCss.css';
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps<{ dehydratedState: DehydratedState }> {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const router = useRouter();

  const [loading, setLoading] = React.useState(false);

  const { appConfig } = pageProps as {
    appConfig: AppConfig;
    dehydratedState: DehydratedState;
  };

  const [queryClient] = React.useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          suspense: false,
        },
      },
    })
  );

  const getLayout = (Component as any).getLayout || ((page: any) => page);

  const theme = React.useMemo(() => {
    let tempTheme = getTheme(defaultAppConfig.theme)?.theme;
    let fontFamily;
    if (appConfig?.font) {
      fontFamily = `'${appConfig.font.family}', ${appConfig.font.category}`;
    }

    if (appConfig) {
      tempTheme = getTheme(appConfig.theme)?.theme;
    }
    if (appConfig && appConfig.theme === 'custom' && appConfig.customTheme) {
      const customTheme = JSON.parse(appConfig.customTheme);

      return responsiveFontSizes(
        fontFamily
          ? createTheme({
              ...customTheme,
              typography: {
                fontFamily,
              },
            })
          : createTheme(customTheme)
      );
    }

    return responsiveFontSizes(
      fontFamily
        ? createTheme({
            ...tempTheme,
            typography: {
              fontFamily,
            },
          })
        : createTheme(tempTheme)
    );
  }, [appConfig]);

  const SEO = React.useMemo(() => {
    const config = appConfig;

    if (config) {
      const seoConfig: any = {
        defaultTitle: config.seo?.home?.title || config.name,
        titleTemplate: `${config.name} | %s`,
        description: config.seo?.home?.description,
        canonical: config.domain,
        openGraph: {
          type: 'website',
          description: config.seo?.home?.description || '',
          locale: config.locale || 'en_US',
          url: config.domain,
          site_name: config.name,
          images: config.seo?.home?.images,
        },
      };

      if (config.social) {
        for (let social of config.social) {
          if (social.type === 'twitter') {
            seoConfig.twitter = {
              handle: `@${social.handle}`,
              site: `@${social.handle}`,
              cardType: 'summary_large_image',
            };
          }
        }
      }

      return seoConfig;
    }
  }, [appConfig]);
  React.useEffect(() => {
    router.events.on('routeChangeStart', () => {
      setLoading(true);
    });

    router.events.on('routeChangeComplete', () => {
      setLoading(false);
    });
    router.events.on('routeChangeError', () => {
      setLoading(false);
    });

    return () => {
      router.events.off('routeChangeStart', () => {
        setLoading(false);
      });
      router.events.off('routeChangeComplete', () => {
        setLoading(false);
      });
      router.events.off('routeChangeError', () => {
        setLoading(false);
      });
    };
  }, [router]);

  const config = appConfig || defaultAppConfig;
  const favicon = config.favicon_url || '/favicon.ico';

  return (
    <>
      <CacheProvider value={emotionCache}>
        <Head>
          <link rel="shortcut icon" href={favicon} />
          <meta name="viewport" content="initial-scale=1, width=device-width" />
          <meta name="theme-color" content={theme?.palette.primary.main} />
        </Head>
        <AppConfigContext.Provider value={config}>
          <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
              <Hydrate state={pageProps.dehydratedState}>
                <Provider>
                  <SnackbarProvider maxSnack={3}>
                    <AppIntlProvider>
                      <DefaultSeo {...SEO} />
                      <CssBaseline />
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <Web3ReactProvider
                          connectors={[
                            [metaMask as any, metaMaskHooks],
                            [walletConnect, walletConnectHooks],
                          ]}
                        >
                          <Updater />
                          <Backdrop
                            sx={{
                              color: theme.palette.primary.main,
                              zIndex: theme.zIndex.drawer + 1,
                            }}
                            open={loading}
                          >
                            <CircularProgress color="inherit" size={80} />
                          </Backdrop>
                          {getLayout(<Component {...pageProps} />)}
                        </Web3ReactProvider>
                      </LocalizationProvider>
                    </AppIntlProvider>
                  </SnackbarProvider>
                </Provider>
              </Hydrate>
            </QueryClientProvider>
          </ThemeProvider>
        </AppConfigContext.Provider>
      </CacheProvider>
    </>
  );
}
