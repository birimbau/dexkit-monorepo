import type {
  GetStaticPaths,
  GetStaticPathsContext,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from 'next';
import MainLayout from '../../../../src/components/layouts/main';

import { dehydrate, QueryClient } from '@tanstack/react-query';
import {
  GET_ASSETS_ORDERBOOK,
  GET_ASSET_DATA,
  GET_ASSET_METADATA,
  GET_COLLECTION_DATA,
} from '../../../../src/hooks/nft';
import { getAppConfig } from '../../../../src/services/app';
import {
  getAssetData,
  getAssetMetadata,
  getCollectionData,
  getDKAssetOrderbook,
} from '../../../../src/services/nft';
import { AppConfig, AppPageSection } from '../../../../src/types/config';
import { getNetworkSlugFromChainId } from '../../../../src/utils/blockchain';

import { SectionsRenderer } from '@/modules/wizard/components/sections/SectionsRenderer';
import { getProviderBySlug } from '../../../../src/services/providers';

const CustomPage: NextPage<{ sections: AppPageSection[] }> = ({ sections }) => {
  return (
    <MainLayout disablePadding>
      <SectionsRenderer sections={sections} />
    </MainLayout>
  );
};

type Params = {
  site?: string;
  page?: string;
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  const queryClient = new QueryClient();
  const appConfig: AppConfig = await getAppConfig(params?.site);
  const homePage = appConfig.pages[params?.page || ''];

  if (!homePage) {
    return {
      notFound: true,
    };
  }

  for (let section of homePage.sections) {
    if (
      section.type === 'featured' ||
      section.type === 'call-to-action' ||
      section.type === 'collections'
    ) {
      for (let item of section.items) {
        if (item.type === 'asset' && item.tokenId !== undefined) {
          const slug = getNetworkSlugFromChainId(item.chainId);

          if (slug === undefined) {
            continue;
          }

          const provider = getProviderBySlug(slug);

          await provider?.ready;

          const asset = await getAssetData(
            provider,
            item.contractAddress,
            item.tokenId
          );

          if (asset) {
            await queryClient.prefetchQuery(
              [GET_ASSET_DATA, item.contractAddress, item.tokenId],
              async () => asset
            );

            const metadata = await getAssetMetadata(asset.tokenURI, {
              image: '',
              name: `${asset.collectionName} #${asset.id}`,
            });

            await queryClient.prefetchQuery(
              [GET_ASSET_METADATA, asset.tokenURI],
              async () => {
                return metadata;
              }
            );
          }
        } else if (item.type === 'collection') {
          const slug = getNetworkSlugFromChainId(item.chainId);

          if (slug === undefined) {
            continue;
          }

          const provider = getProviderBySlug(slug);

          await provider?.ready;

          const collection = await getCollectionData(
            provider,
            item.contractAddress
          );

          await queryClient.prefetchQuery(
            [GET_COLLECTION_DATA, item.contractAddress, item.chainId],
            async () => collection
          );
        }
      }
    }
  }

  for (let section of homePage.sections) {
    if (section.type === 'asset-store') {
      const maker = section.config?.storeAccount?.toLowerCase();
      const assetResponse = await getDKAssetOrderbook({ maker });
      await queryClient.prefetchQuery(
        [GET_ASSETS_ORDERBOOK, { maker }],
        async () => assetResponse.data
      );
    }
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      sections: homePage.sections,
      appConfig,
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

export default CustomPage;
