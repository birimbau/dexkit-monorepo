import AssetStoreStepperContainer from '@/modules/wizard/components/steppers/containers/AssetStoreStepperContainer';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import MainLayout from 'src/components/layouts/main';
import { useAppConfig } from 'src/hooks/app';
import { AuthProvider } from 'src/providers/authProvider';
import { ConfigWizardProvider } from 'src/providers/configWizardProvider';

export const AssetStoreQuickWizard: NextPage = () => {
  const router = useRouter();
  const { clone } = router.query as { clone?: string };
  const { formatMessage } = useIntl();
  const appConfig = useAppConfig();
  return (
    <>
      <NextSeo
        title={formatMessage({
          id: 'quick.store.wizard.title',
          defaultMessage:
            'Create a NFT store app in seconds using our quick wizard',
        })}
        description={formatMessage({
          id: 'quick.swap.wizard.description',
          defaultMessage:
            'Create a NFT store for your account. Share your store to users easily buy the offers you post. A dedicated store to show your NFTs',
        })}
        openGraph={{
          title: 'Create a NFT store app in seconds using our quick wizar',
          description:
            'Create a NFT store for your account. Share your store to users easily buy the offers you post. A dedicated store to show your NFTs',
        }}
      />
      <ConfigWizardProvider>
        <AuthProvider>
          <MainLayout>
            <AssetStoreStepperContainer />
          </MainLayout>
        </AuthProvider>
      </ConfigWizardProvider>
    </>
  );
};

export default AssetStoreQuickWizard;
