import { DexkitProvider } from '@dexkit/ui/components';
import { ThemeMode } from '@dexkit/ui/constants/enum';
import { COMMON_NOTIFICATION_TYPES } from '@dexkit/ui/constants/messages/common';
import { createTheme, responsiveFontSizes, Theme } from '@mui/material';
import { DefaultSeo } from 'next-seo';
import { useMemo, useState } from 'react';
import { WHITELABEL_NOTIFICATION_TYPES } from 'src/constants/messages';
import { useAppConfig, useLocale, useThemeMode } from 'src/hooks/app';
import {
  notificationsAtom,
  selectedWalletAtom,
  transactionsAtomV2,
} from 'src/state/atoms';
import { getTheme } from 'src/theme';
import defaultAppConfig from '../../config/app.json';
import { loadLocaleData } from '../utils/intl';

export interface AppMarketplaceContextProps {
  children: React.ReactNode | React.ReactNode[];
}

export function AppMarketplaceProvider({
  children,
}: AppMarketplaceContextProps) {
  const appConfig = useAppConfig();
  const { locale: defaultLocale } = useLocale();
  const [locale, setLocale] = useState(defaultLocale);
  const { mode, userMode } = useThemeMode();

  const theme = useMemo<Theme>(() => {
    let tempTheme = getTheme({
      name: defaultAppConfig.theme,
      mode:
        defaultAppConfig.theme === 'BoredApe' &&
        !userMode &&
        defaultAppConfig?.defaultThemeMode
          ? ThemeMode.dark
          : mode || (defaultAppConfig?.defaultThemeMode as ThemeMode),
    })?.theme;
    let fontFamily;
    if (appConfig?.font) {
      fontFamily = `'${appConfig.font.family}', ${appConfig.font.category}`;
    }

    if (appConfig) {
      tempTheme = getTheme({ name: appConfig.theme, mode })?.theme;
    }

    if (appConfig && appConfig.theme === 'custom') {
      let customTheme;
      if (appConfig.customTheme) {
        customTheme = JSON.parse(appConfig.customTheme);
      }
      if (mode === ThemeMode.dark && appConfig.customThemeDark) {
        customTheme = JSON.parse(appConfig.customThemeDark);
      }
      if (mode === ThemeMode.light && appConfig.customThemeLight) {
        customTheme = JSON.parse(appConfig.customThemeLight);
      }
      if (customTheme) {
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
  }, [appConfig, mode]);

  const SEO = useMemo(() => {
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
  return (
    <DexkitProvider
      locale={locale}
      defaultLocale={locale}
      localeMessages={loadLocaleData(locale)}
      theme={theme}
      selectedWalletAtom={selectedWalletAtom}
      options={{
        magicRedirectUrl:
          typeof window !== 'undefined'
            ? window.location.href
            : process.env.NEXT_PUBLIC_MAGIC_REDIRECT_URL || '',
      }}
      notificationTypes={{
        ...WHITELABEL_NOTIFICATION_TYPES,
        ...COMMON_NOTIFICATION_TYPES,
      }}
      transactionsAtom={transactionsAtomV2}
      notificationsAtom={notificationsAtom}
      onChangeLocale={(loc) => setLocale(loc)}
    >
      <DefaultSeo {...SEO} />
      {children}
    </DexkitProvider>
  );
}
