import { UserEventsType } from "@dexkit/core/constants/userEvents";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useWeb3React } from "@web3-react/core";
import { AxiosInstance } from "axios";
import { useDexKitContext } from ".";
import { postTrackUserEvent } from "../services/userEvents";

export function useTrackUserEventsMutation() {
  const { userEventURL, siteId, affiliateReferral } = useDexKitContext();
  const { account } = useWeb3React();

  return useMutation(
    async ({
      event,
      metadata,
      hash,
      chainId,
    }: {
      event: UserEventsType;
      metadata?: string;
      hash?: string;
      chainId?: number;
    }) => {
      return postTrackUserEvent({
        event,
        metadata,
        hash,
        chainId,
        siteId,
        account,
        userEventURL,
        referral: affiliateReferral,
      });
    }
  );
}

const USER_EVENTS_LIST_QUERY = "user-events-list-query";

export type UserEvent<T = any> = {
  id: number;
  type: string | null;
  hash: string | null;
  chainId: number | null;
  networkId: string | null;
  status: string | null;
  from: string | null;
  referral: string | null;
  processed: boolean | null;
  createdAt: Date;
  updatedAt: Date;
  siteId: number | null;
  userId: number | null;
  accountId: number | null;
  metadata: any;
  processedMetadata: T;
};

export function useUserEventsList<T = any>({
  instance,
  page = 0,
  pageSize = 10,
  sort,
  siteId,
  filter,
}: {
  page?: number;
  pageSize?: number;
  siteId?: number;
  sort?: string[];
  filter?: any;
  instance?: AxiosInstance | null;
}) {
  return useQuery<{
    data: UserEvent<T>[];
    skip?: number;
    take?: number;
    total?: number;
  }>(
    [USER_EVENTS_LIST_QUERY, siteId, sort, page, pageSize, filter],
    async () => {
      if (instance) {
        return (
          await instance.get<{
            data: UserEvent<T>[];
            skip?: number;
            take?: number;
            total?: number;
          }>(`/user-events/site/all/${siteId}`, {
            params: {
              skip: page * pageSize,
              take: pageSize,
              sort,
              filter: filter ? JSON.stringify(filter) : undefined,
            },
          })
        ).data;
      }

      return { data: [] };
    }
  );
}
