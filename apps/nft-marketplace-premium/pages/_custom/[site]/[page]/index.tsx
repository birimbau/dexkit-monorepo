import type { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import MainLayout from '../../../../src/components/layouts/main';

import { dehydrate, QueryClient } from '@tanstack/react-query';
import {
  GET_ASSETS_ORDERBOOK,
  GET_COLLECTION_DATA,
} from '../../../../src/hooks/nft';
import { getAppConfig } from '../../../../src/services/app';
import {
  fetchAssetForQueryClient,
  getCollectionData,
  getDKAssetOrderbook,
} from '../../../../src/services/nft';

import { getNetworkSlugFromChainId } from '../../../../src/utils/blockchain';

import { GatedConditionRefresher } from '@/modules/wizard/components/GatedConditionRefresher';
import { GatedConditionView } from '@/modules/wizard/components/GatedConditionView';
import { SectionsRenderer } from '@/modules/wizard/components/sections/SectionsRenderer';
import { GatedCondition } from '@/modules/wizard/types';
import { AppPageSection } from '@/modules/wizard/types/section';
import { SessionProvider } from 'next-auth/react';
import AuthMainLayout from 'src/components/layouts/authMain';
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
      <SessionProvider>
        <AuthMainLayout>
          <GatedConditionRefresher conditions={conditions} account={account} />
          <GatedConditionView
            account={account}
            conditions={conditions}
            result={result}
            partialResults={partialResults}
            balances={balances}
          />
        </AuthMainLayout>
      </SessionProvider>
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

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
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
    return {
      redirect: {
        destination: `/_custom_protected/${params?.site}/${params?.page}`,
        permanent: false,
      },
    };
  }
  for (let section of homePage.sections) {
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
  }

  for (let section of homePage.sections) {
    if (section.type === 'asset-store') {
      const maker = section.config?.storeAccount?.toLowerCase();
      const assetResponse = await getDKAssetOrderbook({ maker });
      await queryClient.prefetchQuery(
        [GET_ASSETS_ORDERBOOK, { maker }],
        async () => assetResponse.data,
      );
    }
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      sections: homePage.sections,
      ...configResponse,
    },
    revalidate: 60,
  };
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking', // false or 'blocking'
  };
}

export default CustomPage;
