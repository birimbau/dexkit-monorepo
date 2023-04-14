import WalletStepperContainer from '@/modules/wizard/components/steppers/containers/WalletStepperContainer';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import MainLayout from 'src/components/layouts/main';
import { useWhitelabelConfigQuery } from 'src/hooks/whitelabel';
import { AuthProvider } from 'src/providers/authProvider';
import { ConfigWizardProvider } from 'src/providers/configWizardProvider';

export const SwapQuickWizard: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query as { slug?: string };
  const { formatMessage } = useIntl();
  const { data: site } = useWhitelabelConfigQuery({
    slug,
  });
  return (
    <>
      <NextSeo
        title={formatMessage({
          id: 'quick.wallet.builder.title',
          defaultMessage:
            'Create a crypto wallet in seconds using our quick app builder',
        })}
        description={formatMessage({
          id: 'quick.swap.builder.description',
          defaultMessage:
            'Create a crypto wallet for your token. You can configure it to match the brand of your project',
        })}
        openGraph={{
          title:
            'Create a crypto wallet app in seconds using our quick app builder',
          description:
            'Create a crypto wallet for your token. You can configure it to match the brand of your project',
        }}
      />
      <ConfigWizardProvider>
        <AuthProvider>
          <MainLayout noSsr={true}>
            <WalletStepperContainer site={site} />
          </MainLayout>
        </AuthProvider>
      </ConfigWizardProvider>
    </>
  );
};

export default SwapQuickWizard;
