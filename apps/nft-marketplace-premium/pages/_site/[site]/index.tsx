import type {
  GetStaticPaths,
  GetStaticPathsContext,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from 'next';
import MainLayout from '../../../src/components/layouts/main';

import { dehydrate, QueryClient } from '@tanstack/react-query';
import { getAppConfig } from '../../../src/services/app';

import { SectionsRenderer } from '@/modules/wizard/components/sections/SectionsRenderer';
import { AppPageSection } from '@/modules/wizard/types/section';
import { dexkitNFTapi } from '@dexkit/ui/constants/api';
import { netToQuery } from '@dexkit/ui/utils/networks';
import { GET_ASSETS_ORDERBOOK } from 'src/hooks/nft';
import { getDKAssetOrderbook } from 'src/services/nft';

const Home: NextPage<{ sections: AppPageSection[] }> = ({ sections }) => {
  return (
    <MainLayout disablePadding>
      <SectionsRenderer sections={sections} />
      {/*<ActionButtonsSection />*/}
    </MainLayout>
  );
};

type Params = {
  site?: string;
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  const queryClient = new QueryClient();
  const configResponse = await getAppConfig(params?.site, 'home');
  const { appConfig } = configResponse;
  const homePage = appConfig.pages.home;
  for (let section of homePage.sections) {
    if (section.type === 'asset-store') {
      const maker = section.config?.storeAccount?.toLowerCase();
      const assetResponse = await getDKAssetOrderbook({ maker });
      await queryClient.prefetchQuery(
        [GET_ASSETS_ORDERBOOK, { maker: maker || null }],
        async () => assetResponse.data
      );
    }
  }

  /*for (let section of homePage.sections) {
    if (
      section.type === 'featured' ||
      section.type === 'call-to-action' ||
      section.type === 'collections'
    ) {
      for (let item of section.items) {
        try {
          if (item.type === 'asset' && item.tokenId !== undefined) {
            await fetchAssetForQueryClient({ item, queryClient });
          } else if (item.type === 'collection') {
            const slug = getNetworkSlugFromChainId(item.chainId);

            if (slug === undefined) {
              continue;
            }

            const provider = getProviderBySlug(slug);

            await provider?.ready;

            const collection = await getCollectionData(
              provider,
              item.contractAddress,
            );

            await queryClient.prefetchQuery(
              [GET_COLLECTION_DATA, item.contractAddress, item.chainId],
              async () => collection,
            );
          }
        } catch (e) {
          console.log(e);
        }
      }
    }
  }*/

  await netToQuery({
    instance: dexkitNFTapi,
    queryClient,
    siteId: configResponse.siteId,
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      sections: homePage.sections,
      ...configResponse,
    },
    revalidate: 300,
  };
};

export const getStaticPaths: GetStaticPaths<
  Params
> = ({}: GetStaticPathsContext) => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export default Home;
