import { DexkitApiProvider } from "@dexkit/core/providers";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { CommerceNotification } from "../types";

export const NOTIFICATIONS_QUERY = "NOTIFICATIONS_QUERY";

export default function useNotifications(params: {
  page: number;
  limit: number;
  status: string;
  scope: string;
}) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery([NOTIFICATIONS_QUERY, params], async () => {
    if (!instance) {
      throw new Error("no instance");
    }

    return (
      await instance?.get<{
        items: CommerceNotification[];
        totalItems: number;
        totalPages: number;
        currentPage: number;
      }>("/notifications/", { params })
    ).data;
  });
}
