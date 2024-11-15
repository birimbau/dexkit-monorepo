import { useCallback, useState } from "react";
import { ContainerContext } from "./ContainerContext";

export interface ContainerProviderProps {
  children: (id: string) => React.ReactNode;
  containerId: string;
}

export default function ContainerProvider({
  children,
  containerId,
}: ContainerProviderProps) {
  const [params, setParams] = useState<{ [key: string]: string }>({});

  const [currContainerId, setContainerId] = useState(containerId);

  const handleGet = useCallback(
    (key: string) => {
      return params[key];
    },
    [params]
  );

  const handleSet = useCallback(
    (key: string, value: string) => {
      setParams((params) => {
        params[key] = value;
        return params;
      });
    },
    [params]
  );

  const handleSetContainer = useCallback(
    (containerId: string, params?: { [key: string]: string }) => {
      setContainerId(containerId);
      if (params) {
        setParams(params);
      }
    },
    []
  );

  const handleGoBack = useCallback(() => {}, []);

  return (
    <ContainerContext.Provider
      value={{
        get: handleGet,
        set: handleSet,
        setContainer: handleSetContainer,
        params,
        containerId: currContainerId,
        goBack: handleGoBack,
      }}
    >
      {children(currContainerId)}
    </ContainerContext.Provider>
  );
}
