import { IntlProvider } from 'react-intl';
import { useAppConfig, useLocale } from '../hooks/app';
import { loadLocaleData } from '../utils/intl';

interface Props {
  children?: React.ReactNode | React.ReactNode[];
}

function AppIntlProvider({ children }: Props) {
  const appConfig = useAppConfig();
  const { locale } = useLocale();

  return (
    <IntlProvider
      locale={locale}
      defaultLocale={appConfig.locale}
      messages={loadLocaleData(locale)}
    >
      {children}
    </IntlProvider>
  );
}

export default AppIntlProvider;
