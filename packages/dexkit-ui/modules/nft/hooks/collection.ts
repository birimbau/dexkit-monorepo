import { useAppConfig } from "../../../hooks";

export function useCollections() {
  const appConfig = useAppConfig();
  return appConfig?.collections;
}