import { UserEventsType } from '@dexkit/core/constants/userEvents';
import axios from 'axios';


/**
 * We refresh here the access token, this is called on 401 error
 * @returns 
 */
export async function postTrackUserEvent({ event, metadata, hash, chainId, siteId, account, userEventURL, referral }: { event: UserEventsType, metadata?: string, hash?: string, chainId?: number, siteId?: number, account?: string, userEventURL?: string, referral?: string }) {
  if (!userEventURL) {
    return;
  }


  return await axios.post(userEventURL, {
    event,
    metadata,
    hash,
    chainId,
    siteId,
    account,
    referral

  }, { withCredentials: true });


}