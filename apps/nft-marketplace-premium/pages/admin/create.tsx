import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import MainLayout from '../../src/components/layouts/main';
import { useAppConfig } from '../../src/hooks/app';
import { CreateWizardContainer } from '../../src/modules/wizard/components/containers/CreateWizardContainer';
import { AuthProvider } from '../../src/providers/authProvider';
import { ConfigWizardProvider } from '../../src/providers/configWizardProvider';

export const WizardCreatePage: NextPage = () => {
  const router = useRouter();
  const { clone } = router.query as { clone?: string };
  const { formatMessage } = useIntl();
  const appConfig = useAppConfig();
  return (
    <>
      <NextSeo
        title={formatMessage({
          id: 'create.marketplace.title',
          defaultMessage: 'Create your crypto site/marketplace in seconds.',
        })}
        description={formatMessage({
          id: 'admin.setup.description',
          defaultMessage:
            'Start your own crypto site/marketplace in seconds. Start now being a crypto enterpreneur in two steps: create wallet, fill name of your marketplace and you are ready to go.',
        })}
        openGraph={{
          title: 'Create your crypto site/marketplace in seconds.',
          description:
            'Start your own crypto site/marketplace in seconds. Start now being a crypto enterpreneur in two steps: create wallet, fill name of your marketplace and you are ready to go.',
          images: [
            {
              url: `${appConfig.domain}/assets/images/seo_create.jpg`,
              width: 800,
              height: 600,
              alt: 'DexKit create wizard',
              type: 'image/jpeg',
            },
          ],
        }}
      />
      <ConfigWizardProvider>
        <AuthProvider>
          <MainLayout noSsr={true}>
            <CreateWizardContainer slug={clone} />
          </MainLayout>
        </AuthProvider>
      </ConfigWizardProvider>
    </>
  );
};

export default WizardCreatePage;
