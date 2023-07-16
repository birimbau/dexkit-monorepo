//export * from './components/Render';

import { TokenWhitelabelApp } from "@dexkit/core/types";
import { DexkitProvider } from "@dexkit/ui";
import { AppNotification } from "@dexkit/ui/types";
import { AppConfig } from "@dexkit/ui/types/config";
import { experimental_extendTheme as extendTheme } from "@mui/material/styles";
import { atom } from "jotai";
import { SectionRender } from "./components/SectionRender";
import MainLayout from "./components/layout/main";
import { useWhitelabelConfigQuery } from "./hooks";

interface Props {
  slug: string;
  section?: string;
  page?: string;
  withLayout?: boolean;
}

export default function RenderDexAppBuilder({ slug, page, withLayout }: Props) {
  const configResponse = useWhitelabelConfigQuery({ slug, page });

  if (configResponse.data) {
    const toRender = (
      JSON.parse(configResponse.data.config) as AppConfig
    ).pages[page || "home"].sections.map((section, k) => (
      <SectionRender key={k} section={section} />
    ));

    return (
      <DexkitProvider
        theme={extendTheme()}
        locale="en-US"
        assetsAtom={atom({})}
        currencyUserAtom={atom("")}
        tokensAtom={atom<TokenWhitelabelApp[]>([])}
        notificationTypes={{}}
        notificationsAtom={atom<AppNotification[]>([])}
        onChangeLocale={() => {}}
        transactionsAtom={atom<{}>({})}
        selectedWalletAtom={atom<string>("")}
      >
        {withLayout ? (
          <MainLayout>
            <>{toRender}</>
          </MainLayout>
        ) : (
          <>{toRender}</>
        )}
      </DexkitProvider>
    );
  }

  return <></>;
}

export function renderDexAppBuilderFromConfig({
  config,
  page,
}: {
  config: AppConfig;
  page?: string;
}) {
  const toRender = config.pages[page || "home"].sections.map((section, k) => (
    <SectionRender key={k} section={section} />
  ));
  return <>{toRender}</>;
}
