import { useRouter } from 'next/router';

import { SectionsRenderer } from '@/modules/wizard/components/sections/SectionsRenderer';

import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import {
  GetStaticPaths,
  GetStaticPathsContext,
  GetStaticProps,
  GetStaticPropsContext,
} from 'next';
import { useMemo } from 'react';
import { useWhitelabelConfigQuery } from 'src/hooks/whitelabel';
import { getAppConfig } from 'src/services/app';

import PreviewAuthLayout from 'src/components/layouts/PreviewAuthLayout';

function PreviewPage() {
  const router = useRouter();

  const { slug, page, index } = router.query;

  console.log(router.query);

  const { data } = useWhitelabelConfigQuery({ slug: slug as string });

  const appConfig = useMemo(() => {
    if (data?.config) {
      return JSON.parse(data.config) as AppConfig;
    }
  }, [data]);

  const sections = useMemo(() => {
    const sectionIndex = parseInt((index as string) ?? '-1');

    console.log('sectionIndex', sectionIndex);

    if (sectionIndex >= 0) {
      return appConfig
        ? [appConfig.pages[page as string].sections[sectionIndex]] ?? []
        : [];
    }

    return appConfig ? appConfig.pages[page as string].sections ?? [] : [];
  }, [appConfig, page, index]);

  return <SectionsRenderer sections={sections} />;
}

(PreviewPage as any).getLayout = function getLayout(page: any) {
  return <PreviewAuthLayout noSsr>{page}</PreviewAuthLayout>;
};

type Params = {
  site?: string;
  page?: string;
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  const queryClient = new QueryClient();
  const configResponse = await getAppConfig(params?.site, 'no-page-defined');

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
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

export default PreviewPage;
