import { DexkitApiProvider } from "@dexkit/core/providers";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useContext } from "react";

export const USER_ACTIVITY_QUERY = "USER_ACTIVITY_QUERY";

export interface UserActivityParams {
  account?: string;
}

export type UserEvent = {
  id: number;
  type: string | null;
  hash: string | null;
  chainId: number | null;
  networkId: string | null;
  status: string | null;
  from: string | null;
  referral: string | null;
  processed: boolean | null;
  createdAt: string;
  updatedAt: string;
  siteId: number | null;
  userId: number | null;
  accountId: number | null;
  metadata: any | null;
  processedMetadata: any | null;
};

export default function useUserActivity({ account }: UserActivityParams) {
  const { instance } = useContext(DexkitApiProvider);

  return useInfiniteQuery(
    [USER_ACTIVITY_QUERY, account],
    async ({ pageParam = 0 }) => {
      const data = (
        await instance?.get<{ count: number; data: UserEvent[]; page: number }>(
          "/user-events/events",
          { params: { page: pageParam, pageSize: 5 } }
        )
      )?.data;

      console.log("chama papai");

      return data;
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage) {
          return lastPage?.page + 1;
        }
      },
    }
  );
}
