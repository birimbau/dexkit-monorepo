import { UserEventsType } from "@dexkit/core/constants/userEvents";
import { DexkitApiProvider } from "@dexkit/core/providers";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useWeb3React } from "@web3-react/core";
import { AxiosInstance } from "axios";
import { useContext } from "react";
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

export type CountFilter = {
  siteId?: number;
  chainId?: number;
  referral?: string;
  skip?: number;
  take?: number;
  from?: string;
  start: string;
  end: string;
  type?: string;
};

export const TOP_USER_EVENTS_QUERY = "TOP_USER_EVENTS_QUERY";

export function useTopUserEvents({ filters }: { filters: CountFilter }) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery([TOP_USER_EVENTS_QUERY, filters], async () => {
    if (!filters.siteId) {
      return [];
    }

    if (!instance) {
      throw new Error("no http client");
    }

    return (
      (
        await instance?.get<{ count: number; name: string }[]>(
          "/user-events/count-by-type",
          {
            params: filters,
          }
        )
      ).data || []
    );
  });
}

const COUNT_USER_EVENTS_QUERY = "COUNT_USER_EVENTS_QUERY";

export function useCountUserEvents({ filters }: { filters: CountFilter }) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery([COUNT_USER_EVENTS_QUERY, filters], async () => {
    if (!filters.siteId) {
      return 0;
    }

    if (!instance) {
      throw new Error("no http client");
    }

    return (
      (
        await instance?.get<{ count: number }>("/user-events/count", {
          params: filters,
        })
      ).data?.count || Number(0)
    );
  });
}
