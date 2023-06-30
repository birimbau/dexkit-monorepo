import { AppConfig } from "@dexkit/ui/types/config";
import { createRoot } from "react-dom/client";
import { SectionRender } from "./components/SectionRender";
import { useWhitelabelConfigQuery } from "./hooks";

interface Props {
  slug: string;
  section?: string;
  page?: string;
  withLayout?: boolean;
}

export function renderDexAppBuilder({ slug, page }: Props) {
  const configResponse = useWhitelabelConfigQuery({ slug, page });

  if (configResponse.data) {
    const toRender = (
      JSON.parse(configResponse.data.config) as AppConfig
    ).pages[page || "home"].sections.map((section, k) => (
      <SectionRender key={k} section={section} />
    ));
    return <>{toRender}</>;
  }

  return <></>;
}

export function renderDexAppBuilderFromConfig({
  config,
}: {
  config: AppConfig;
}) {
  const toRender = config.pages["home"].sections.map((section, k) => (
    <SectionRender key={k} section={section} />
  ));
  return <>{toRender}</>;
}

export function renderDexAppBuilderWidget({ id }: { id: string }) {
  const container = document.getElementById(id);

  const root = createRoot(container!);

  root.render(renderDexAppBuilder({ slug: "crypto-fans" }));
}
