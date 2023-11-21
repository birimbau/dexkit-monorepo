import { UserEventsType } from '@dexkit/core/constants/userEvents';
import { useMutation } from "@tanstack/react-query";
import { useWeb3React } from '@web3-react/core';
import { useDexKitContext } from '.';
import { postTrackUserEvent } from '../services/userEvents';





export function useTrackUserEventsMutation() {
  const { userEventURL, siteId, affiliateReferral } = useDexKitContext();
  const { account } = useWeb3React();

  return useMutation(async ({ event, metadata, hash, chainId }: { event: UserEventsType, metadata?: string, hash?: string, chainId?: number }) => {

    return postTrackUserEvent({ event, metadata, hash, chainId, siteId, account, userEventURL, referral: affiliateReferral });

  })
}