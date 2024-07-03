import { myAppsApi } from "@dexkit/ui/constants/api";
import { WidgetConfig } from "@dexkit/ui/modules/wizard/types/widget";


/**
 * Get config by name or domain, at least one of these parameters should be passed
 * @param queryParameters
 * @returns
 */
export async function getWidgetConfig(queryParameters: {
  id?: number
}) {
  return await myAppsApi.get<WidgetConfig>(`/widget/admin`, {
    params: {
      id: queryParameters.id
    },
  });
}

/**
 * Get all configs associated with a wallet
 * @param owner
 * @returns
 */
export async function getWidgetsByOwner(owner: string) {
  return await myAppsApi.get<WidgetConfig[]>(`/widget/list/${owner}`);
}