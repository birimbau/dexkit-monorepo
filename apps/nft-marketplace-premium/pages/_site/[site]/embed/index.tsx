import jwt_decode from 'jwt-decode';
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from 'next';
import MainLayout from '../../../../src/components/layouts/main';

import { dehydrate, QueryClient } from '@tanstack/react-query';
import { getAppConfig } from '../../../../src/services/app';

import { getUserByAccountRefresh } from '@/modules/user/services';
import { GatedConditionRefresher } from '@/modules/wizard/components/GatedConditionRefresher';
import { GatedConditionView } from '@/modules/wizard/components/GatedConditionView';
import { SectionsRenderer } from '@/modules/wizard/components/sections/SectionsRenderer';
import { checkGatedConditions } from '@/modules/wizard/services';
import { AppPageSection } from '@/modules/wizard/types/section';
import { GatedCondition } from '@dexkit/ui/types/config';
import { NoSsr } from '@mui/material';
import { SessionProvider } from 'next-auth/react';
import AuthMainLayout from 'src/components/layouts/authMain';

const EmbedPage: NextPage<{
  sections: AppPageSection[];
  account?: string;
  isProtected: boolean;
  conditions?: GatedCondition[];
  result: boolean;
  hideLayout: boolean;
  partialResults: { [key: number]: boolean };
  balances: { [key: number]: string };
}> = ({
  sections,
  isProtected,
  account,
  conditions,
  hideLayout,
  result,
  partialResults,
  balances,
}) => {
  if (isProtected) {
    return (
      <NoSsr>
        <SessionProvider>
          <AuthMainLayout>
            <GatedConditionRefresher
              conditions={conditions}
              account={account}
            />
            <GatedConditionView
              account={account}
              conditions={conditions}
              result={result}
              partialResults={partialResults}
              balances={balances}
            />
          </AuthMainLayout>
        </SessionProvider>
      </NoSsr>
    );
  }

  if (hideLayout) {
    return (
      <NoSsr>
        <SectionsRenderer sections={sections} />
      </NoSsr>
    );
  } else {
    return (
      <MainLayout disablePadding noSsr={true}>
        <SectionsRenderer sections={sections} />
      </MainLayout>
    );
  }
};

type Params = {
  site?: string;
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
  query,
}: GetServerSidePropsContext<Params>) => {
  const queryClient = new QueryClient();
  const { page, hideLayout } = query;

  const hideM = hideLayout || false;

  const sitePage = page as string;

  const configResponse = await getAppConfig(params?.site, sitePage);
  const { appConfig } = configResponse;
  const homePage = appConfig.pages[sitePage || ''];
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
          hideLayout: hideM,
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
        try {
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
                hideLayout: hideM,
                ...configResponse,
              },
            };
          }
        } catch {
          return {
            props: {
              isProtected: true,
              account: account,
              sections: homePage.sections,
              result: false,
              balances: {},
              hideLayout: hideM,
              partialResults: {},
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
            hideLayout: hideM,
            balances: {},
            partialResults: {},
            ...configResponse,
          },
        };
      }
    }
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      sections: homePage.sections,
      hideLayout: hideM,
      ...configResponse,
    },
  };
};

export default EmbedPage;
