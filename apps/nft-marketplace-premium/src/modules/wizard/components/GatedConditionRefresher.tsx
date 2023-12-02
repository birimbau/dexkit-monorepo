import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useCheckGatedConditions } from '../hooks';
import { GatedCondition } from '../types';

export function GatedConditionRefresher({
  conditions,
  account,
}: {
  conditions?: GatedCondition[];
  account?: string;
}) {
  const router = useRouter();
  const { data } = useCheckGatedConditions({ conditions, account });

  useEffect(() => {
    if (data?.result) {
      router.reload();
    }
  }, [data]);

  return <></>;
}
