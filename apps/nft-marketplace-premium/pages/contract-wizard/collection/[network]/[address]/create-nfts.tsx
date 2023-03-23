import WizardCreateAssetContainer from '@/modules/contract-wizard/components/WizardCreateAssetContainer';

import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import MainLayout from 'src/components/layouts/main';
import { useAppConfig } from 'src/hooks/app';
import { AuthProvider } from 'src/providers/authProvider';

const WizardCreateAssetPage: NextPage = () => {
  const router = useRouter();
  const { address, network } = router.query;
  const appConfig = useAppConfig();
  const { formatMessage } = useIntl();
  return (
    <AuthProvider>
      <NextSeo
        title={formatMessage({
          id: 'contract.generator',
          defaultMessage: 'Contract generator',
        })}
        description={formatMessage({
          id: 'contract.wizard.description',
          defaultMessage:
            'Easily create your digital collectibles (NFTs) using AI image generation tools and create them on the blockchain of your choice in one click.',
        })}
        openGraph={{
          title: 'NFT creator with AI tool.',
          description:
            'Generate NFT collections by drawing each piece using natural language and create them on the blockchain of your choice within the same app.',
          images: [
            {
              url: `${appConfig.domain}/assets/images/create-nft-collection-wizard.jpg`,
              width: 800,
              height: 600,
              alt: 'DexKit images list',
              type: 'image/jpeg',
            },
          ],
        }}
      />
      <MainLayout>
        <WizardCreateAssetContainer
          address={address as string}
          network={network as string}
        />
      </MainLayout>
    </AuthProvider>
  );
};

export default WizardCreateAssetPage;
