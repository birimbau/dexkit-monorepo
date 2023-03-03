import SwapStepperContainer from '@/modules/wizard/components/steppers/containers/SwapStepperContainer';
import SwapStepper from '@/modules/wizard/components/steppers/SwapStepper/SwapStepper';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import MainLayout from 'src/components/layouts/main';
import { useAppConfig } from 'src/hooks/app';
import { AuthProvider } from 'src/providers/authProvider';
import { ConfigWizardProvider } from 'src/providers/configWizardProvider';

export const SwapQuickWizard: NextPage = () => {
  const router = useRouter();
  const { clone } = router.query as { clone?: string };
  const { formatMessage } = useIntl();
  const appConfig = useAppConfig();
  return (
    <>
      <NextSeo
        title={formatMessage({
          id: 'quick.swap.wizard.title',
          defaultMessage:
            'Create a crypto aggregator app in seconds using our quick wizard',
        })}
        description={formatMessage({
          id: 'quick.swap.wizard.description',
          defaultMessage:
            'Create a crypto aggregator for your token or to earn fees for people trading on it. You can configure it to match the brand of your project and facilitate for yours trading',
        })}
        openGraph={{
          title:
            'Create a crypto aggregator app in seconds using our quick wizard',
          description:
            'Create a crypto aggregator for your token or to earn fees for people trading on it. You can configure it to match the brand of your project and facilitate for yours trading',
        }}
      />
      <ConfigWizardProvider>
        <AuthProvider>
          <MainLayout noSsr={true}>
            <SwapStepperContainer />
          </MainLayout>
        </AuthProvider>
      </ConfigWizardProvider>
    </>
  );
};

export default SwapQuickWizard;
