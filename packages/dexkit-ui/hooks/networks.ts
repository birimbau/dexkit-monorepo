import { ChainId } from "@dexkit/core";
import { DexkitApiProvider } from "@dexkit/core/providers";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useContext, useMemo } from "react";
import { useNetworkMetadata, useSiteIdV2 } from "./app";

const ACTIVE_NETWORKS_QUERY = "ACTIVE_NETWORKS_QUERY";

export function useActiveNetworks({
  query,
  page,
  limit,
}: {
  page: number;
  limit: number;
  query: string;
}) {
  const { instance } = useContext(DexkitApiProvider);

  const { siteId } = useSiteIdV2();

  return useInfiniteQuery(
    [ACTIVE_NETWORKS_QUERY, query, page, limit, siteId],
    async () => {
      if (!instance) {
        return [];
      }
      return (
        await instance.get("/networks/metadata/active", {
          params: { q: query, page, limit, siteId },
        })
      ).data;
    },
    {
      getNextPageParam: (lastPage, page) => {
        return lastPage.page + 1;
      },
      getPreviousPageParam: (first, allPages) => {
        if (first.page > 1) {
          return first.page - 1;
        }
      },
    }
  );
}

export const SEARCH_NETWORKS_QUERY = "SEARCH_NETWORKS_QUERY";

export function useSearchNetworks({
  query,
  page,
  limit,
}: {
  page: number;
  limit: number;
  query: string;
}) {
  const { instance } = useContext(DexkitApiProvider);

  return useInfiniteQuery(
    [SEARCH_NETWORKS_QUERY, query, page, limit],
    async () => {
      if (!instance) {
        return { data: [], page: 1, pageSize: 10, totalPages: 0 } as {
          data: any[];
          page: number;
          pageSize: number;
          totalPages: number;
        };
      }

      return (
        await instance.get("/networks/metadata/search", {
          params: { q: query, page, limit },
        })
      ).data as {
        data: any[];
        page: number;
        pageSize: number;
        totalPages: number;
      };
    },
    {
      getNextPageParam: ({ page }) => {
        return page + 1;
      },
      getPreviousPageParam: ({ page }) => {
        return page - 1;
      },
    }
  );
}

export const SEARCH_UNACTIVE_NETWORKS_QUERY = "SEARCH_UNACTIVE_NETWORKS_QUERY";

export function useSearchUnactive({
  query,
  page,
  limit,
}: {
  page: number;
  limit: number;
  query: string;
}) {
  const { instance } = useContext(DexkitApiProvider);

  const { siteId } = useSiteIdV2();

  return useInfiniteQuery(
    [SEARCH_UNACTIVE_NETWORKS_QUERY, query, page, limit, siteId],
    async () => {
      if (!instance) {
        return { data: [], page: 1, pageSize: 10, totalPages: 0 } as {
          data: any[];
          page: number;
          pageSize: number;
          totalPages: number;
        };
      }

      return (
        await instance.get("/networks/metadata/search/unactive", {
          params: { q: query, page, limit, siteId },
        })
      ).data as {
        data: any[];
        page: number;
        pageSize: number;
        totalPages: number;
      };
    },
    {
      getNextPageParam: ({ page }) => {
        return page + 1;
      },
      getPreviousPageParam: ({ page }) => {
        return page - 1;
      },
    }
  );
}

export function useNetworkProvider(chainId?: ChainId) {
  const { NETWORK_PROVIDER } = useNetworkMetadata();

  return useMemo(() => {
    return NETWORK_PROVIDER(chainId);
  }, [NETWORK_PROVIDER]);
}
