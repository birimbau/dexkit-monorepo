import { GatedConditionView } from '@/modules/wizard/components/GatedConditionView';
import { SectionsRenderer } from '@/modules/wizard/components/sections/SectionsRenderer';
import { useCheckGatedConditions } from '@/modules/wizard/hooks';
import { useAuth } from '@dexkit/ui/hooks/auth';
import { useWeb3React } from '@dexkit/ui/hooks/thirdweb';
import {
  GatedCondition,
  GatedPageLayout,
} from '@dexkit/ui/modules/wizard/types';

import { useProtectedAppConfig } from 'src/hooks/app';

export default function ProtectedContent({
  isProtected,
  conditions,
  site,
  page,
  layout,
  slug,
}: {
  isProtected: boolean;
  layout?: GatedPageLayout;
  conditions?: GatedCondition[];
  site: string;
  slug?: string;
  page: string;
}) {
  const { account } = useWeb3React();
  const { isLoggedIn } = useAuth();
  const { data: conditionsData } = useCheckGatedConditions({
    conditions,
    account,
  });
  const { data } = useProtectedAppConfig({
    isProtected,
    domain: site,
    slug,
    page,
    result: conditionsData?.result,
  });

  if (data?.data?.result) {
    return <SectionsRenderer sections={data?.data?.sections} />;
  }

  return (
    <>
      <GatedConditionView
        account={account}
        conditions={conditions}
        layout={layout}
        isLoggedIn={isLoggedIn}
        result={conditionsData?.result}
        partialResults={conditionsData?.partialResults}
        balances={conditionsData?.balances}
      />
    </>
  );
}
