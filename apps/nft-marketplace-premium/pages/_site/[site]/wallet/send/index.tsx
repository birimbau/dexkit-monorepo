import SendContainer from '@/modules/wallet/components/containers/SendContainer';
import type { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';

import MainLayout from 'src/components/layouts/main';
import { getAppConfig } from 'src/services/app';

const Send: NextPage = () => {
  return <SendContainer />;
};

type Params = {
  site?: string;
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  if (params !== undefined) {
    const { site } = params;

    const configResponse = await getAppConfig(site, '');

    return {
      props: { ...configResponse },
    };
  }

  return {
    props: {},
  };
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking', // false or 'blocking'
  };
}

(Send as any).getLayout = function getLayout(page: any) {
  return <MainLayout noSsr>{page}</MainLayout>;
};

export default Send;
