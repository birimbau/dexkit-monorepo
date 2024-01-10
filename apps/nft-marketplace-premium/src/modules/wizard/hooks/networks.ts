import { DexkitApiProvider } from '@dexkit/core/providers';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { useContext } from 'react';

export const DEFAULT_NETWORKS_QUERY = 'DEFAULT_NETWORKS_QUERY';

export function useDefaultNetworks({
  query,
  page,
  siteId,
  limit,
}: {
  page: number;
  limit: number;
  query: string;
  siteId?: number;
}) {
  const { instance } = useContext(DexkitApiProvider);

  return useInfiniteQuery(
    [DEFAULT_NETWORKS_QUERY, query, page, limit],
    async () => {
      if (!instance) {
        return { data: [], page: 1, pageSize: 10, totalPages: 0 };
      }

      return (
        await instance.get('/networks/metadata/default', {
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

const ACTIVE_NETWORKS_QUERY = 'ACTIVE_NETWORKS_QUERY';

export function useActiveNetworks({
  query,
  page,
  siteId,
  limit,
}: {
  page: number;
  limit: number;
  query: string;
  siteId?: number;
}) {
  const { instance } = useContext(DexkitApiProvider);

  return useInfiniteQuery(
    [ACTIVE_NETWORKS_QUERY, query, page, limit],
    async () => {
      if (!instance) {
        return { data: [], page: 1, pageSize: 10, totalPages: 0 };
      }

      return (
        await instance.get('/networks/metadata/active', {
          params: { q: query, page, limit, siteId },
        })
      ).data;
    }
  );
}

export function useSetNetworksActive() {
  const { instance } = useContext(DexkitApiProvider);

  return useMutation(
    async ({ networks, siteId }: { networks: number[]; siteId: number }) => {
      if (!instance) {
        return;
      }

      return await instance.post('/networks/metadata/active', {
        networkIds: networks,
        siteId,
      });
    }
  );
}

export function useDeleteNetworksActive() {
  const { instance } = useContext(DexkitApiProvider);

  return useMutation(
    async ({ networks, siteId }: { networks: number[]; siteId: number }) => {
      if (!instance) {
        return;
      }

      return await instance.delete('/networks/metadata/active', {
        data: {
          networkIds: networks,
          siteId,
        },
      });
    }
  );
}

export const SEARCH_NETWORKS_QUERY = 'SEARCH_NETWORKS_QUERY';

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
        await instance.get('/networks/metadata/search', {
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
