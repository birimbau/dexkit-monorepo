import jwt_decode from 'jwt-decode';
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from 'next';
import MainLayout from '../../../../src/components/layouts/main';

import { dehydrate, QueryClient } from '@tanstack/react-query';
import {
  GET_ASSET_DATA,
  GET_ASSET_METADATA,
  GET_ASSETS_ORDERBOOK,
  GET_COLLECTION_DATA,
} from '../../../../src/hooks/nft';
import { getAppConfig } from '../../../../src/services/app';
import {
  getAssetData,
  getAssetMetadata,
  getCollectionData,
  getDKAssetOrderbook,
} from '../../../../src/services/nft';

import { getNetworkSlugFromChainId } from '../../../../src/utils/blockchain';

import { getUserByAccountRefresh } from '@/modules/user/services';
import { GatedConditionView } from '@/modules/wizard/components/GatedConditionView';
import { SectionsRenderer } from '@/modules/wizard/components/sections/SectionsRenderer';
import { checkGatedConditions } from '@/modules/wizard/services';
import { GatedCondition } from '@/modules/wizard/types';
import { AppPageSection } from '@/modules/wizard/types/section';
import { getProviderBySlug } from '../../../../src/services/providers';

const CustomPage: NextPage<{
  sections: AppPageSection[];
  account?: string;
  isProtected: boolean;
  conditions?: GatedCondition[];
  result: boolean;
  partialResults: { [key: number]: boolean };
  balances: { [key: number]: string };
}> = ({
  sections,
  isProtected,
  account,
  conditions,
  result,
  partialResults,
  balances,
}) => {
  if (isProtected) {
    return (
      <MainLayout>
        <GatedConditionView
          account={account}
          conditions={conditions}
          result={result}
          partialResults={partialResults}
          balances={balances}
        />
      </MainLayout>
    );
  }

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

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
  query,
}: GetServerSidePropsContext<Params>) => {
  const queryClient = new QueryClient();
  const configResponse = await getAppConfig(params?.site, params?.page);
  const { appConfig } = configResponse;
  const homePage = appConfig.pages[params?.page || ''];
  if (!homePage) {
    return {
      redirect: {
        destination: '/404',
        permanent: true,
      },
    };
  }
  if (homePage.gatedConditions && homePage.gatedConditions.length > 0) {
    const token = req.cookies.refresh_token;
    // if user not authenticated, we just need to say that is protected page and needs authentication
    if (!token) {
      return {
        props: {
          isProtected: true,
          account: undefined,
          sections: homePage.sections,
          result: false,
          balances: {},
          partialResults: {},
          ...configResponse,
        },
      };
    }
    if (token) {
      try {
        await getUserByAccountRefresh({ token });
        const account = (jwt_decode(token) as { address: string }).address;
        const conditions = homePage.gatedConditions;
        const gatedResults = await checkGatedConditions({
          account,
          conditions,
        });

        if (!gatedResults?.result) {
          return {
            props: {
              isProtected: true,
              account: account,
              sections: homePage.sections,
              result: gatedResults?.result,
              balances: gatedResults?.balances,
              partialResults: gatedResults?.partialResults,
              conditions: homePage.gatedConditions,
              ...configResponse,
            },
          };
        }
      } catch {
        // error on getting token needs to authenticate again
        return {
          props: {
            isProtected: true,
            account: undefined,
            sections: homePage.sections,
            result: false,
            balances: {},
            partialResults: {},
            ...configResponse,
          },
        };
      }
    }
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
      ...configResponse,
    },
  };
};

export default CustomPage;
