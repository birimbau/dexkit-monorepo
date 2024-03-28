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
import {
  fetchMultipleAssetForQueryClient,
  getDKAssetOrderbook,
} from 'src/services/nft';

const imgUrl =
  'https://c4.wallpaperflare.com/wallpaper/1000/190/378/3-316-16-9-aspect-ratio-s-sfw-wallpaper-preview.jpg';

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
  locale,
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
  await fetchMultipleAssetForQueryClient({
    queryClient,
    sections: homePage.sections,
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
