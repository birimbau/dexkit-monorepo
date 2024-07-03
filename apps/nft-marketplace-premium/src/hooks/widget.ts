import { useAuth } from "@dexkit/ui/hooks/auth";
import { useQuery } from "@tanstack/react-query";
import { getWidgetConfig, getWidgetsByOwner } from 'src/services/widget';


interface ConfigsByOwnerParams {
  owner?: string;
}

export const QUERY_WIDGET_CONFIGS_BY_OWNER_NAME =
  'GET_WIDGET_CONFIGS_BY_OWNER_QUERY';

export const useWidgetsByOwnerQuery = ({
  owner,
}: ConfigsByOwnerParams) => {
  return useQuery([QUERY_WIDGET_CONFIGS_BY_OWNER_NAME, owner], async () => {
    if (!owner) return null;


    const { data } = await getWidgetsByOwner(owner);

    return data;
  });
};

export const QUERY_ADMIN_WHITELABEL_CONFIG_NAME = 'GET_ADMIN_WIDGET_CONFIG_QUERY';
/**
 * get widget config by name or query
 * @param param0
 * @returns
 */
export const useAdminWidgetConfigQuery = ({
  id,
}: {
  id?: number
}) => {
  const { setIsLoggedIn } = useAuth();


  return useQuery(
    [QUERY_ADMIN_WHITELABEL_CONFIG_NAME, id || null],
    async () => {
      if (id === undefined) {
        return null;
      }

      const response = (await getWidgetConfig({ id }));

      if (response.status === 401 && setIsLoggedIn) {
        setIsLoggedIn(false);
      }
      return response.data


    },
    { refetchOnWindowFocus: false, refetchOnReconnect: false }
  );
};