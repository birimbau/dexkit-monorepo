import { AppConfig } from "@dexkit/ui/types/config";
import { useWhitelabelConfigQuery } from "../hooks";
import { SectionRender } from "./SectionRender";

interface Props {
  slug: string;
  section?: string;
  page?: string;
  withLayout?: boolean;
}

export default function RenderDexAppBuilder({ slug, page }: Props) {
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
