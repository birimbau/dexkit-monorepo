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
import { GET_ASSETS_ORDERBOOK } from 'src/hooks/nft';
import { getDKAssetOrderbook } from 'src/services/nft';

import { NETWORK_FROM_SLUG } from '@dexkit/core/constants/networks';
import { Value } from '@react-page/editor';
import { parseNFTPageEditorConfig, returnNFTmap } from 'src/utils/nfts';

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

  let assetsToFetch = new Map<number, Map<string, Set<string>>>();

  for (let section of homePage.sections) {
    if (
      section.type === 'featured' ||
      section.type === 'call-to-action' ||
      section.type === 'collections'
    ) {
      for (let item of section.items) {
        if (item.type === 'asset' && item.tokenId !== undefined) {
          assetsToFetch = returnNFTmap({
            address: item.contractAddress.toLowerCase(),
            chainId: item.chainId,
            tokenId: item.tokenId,
            currentMap: assetsToFetch,
          });
        }
      }
    }
    if (section.type === 'asset-section') {
      const data = section.config;
      assetsToFetch = returnNFTmap({
        address: data.address.toLowerCase(),
        chainId: NETWORK_FROM_SLUG(data.network)?.chainId,
        tokenId: data.tokenId,
        currentMap: assetsToFetch,
      });
    }
    if (section.type === 'custom') {
      const config = section.data
        ? (JSON.parse(section.data) as Value)
        : undefined;
      if (config) {
        const editorNfts = parseNFTPageEditorConfig({ config });
        for (const item of editorNfts) {
          assetsToFetch = returnNFTmap({
            address: item.contractAddress.toLowerCase(),
            chainId: item.chainId,
            tokenId: item.id,
            currentMap: assetsToFetch,
          });
        }
      }
    }
  }

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
