import { useAtomValue } from 'jotai';
import { IntlProvider } from 'react-intl';
import { useAppConfig } from '../hooks/app';
import { localeAtom } from '../state/atoms';
import { loadLocaleData } from '../utils/intl';

interface Props {
  children?: React.ReactNode | React.ReactNode[];
}

function AppIntlProvider({ children }: Props) {
  const appConfig = useAppConfig();
  const locale = useAtomValue(localeAtom);

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
