import { AxiosInstance } from "axios";
import { NetworkMetadata } from "../types/api";

export async function getActiveNetworks({
  query,
  page,
  limit,
  siteId,
  instance,
}: {
  instance: AxiosInstance;
  query?: string;
  page?: number;
  limit?: number;
  siteId?: number;
}) {
  return (
    await instance.get<NetworkMetadata[]>("/networks/metadata/active", {
      params: { q: query, page, limit, siteId },
    })
  ).data;
}
