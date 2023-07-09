import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { AppPageSection } from "../types";
const AssetStoreSection = dynamic(() => import("./sections/AssetStoreSection"));
const MDSection = dynamic(() => import("./sections/MDSection"));

const CallToActionSection = dynamic(
  () => import("./sections/CallToActionSection")
);
const WalletSection = dynamic(() => import("./sections/WalletSection"));
const CollectionsSection = dynamic(
  () => import("./sections/CollectionsSection")
);
const CustomSection = dynamic(() => import("./sections/CustomSection"));
const FeaturedSection = dynamic(() => import("./sections/FeaturedSection"));
const SwapSection = dynamic(() => import("./sections/SwapSection"));
const VideoSection = dynamic(() => import("./sections/VideoSection"));

const ContractSection = dynamic(() => import("./sections/ContractSection"));
const UserContractSection = dynamic(
  () => import("./sections/UserContractSection")
);

interface Props {
  section: AppPageSection;
}

function LoadPlugin({ path, data }: { path: string; data: any }) {
  const [pluginRender, setPluginRender] = useState<
    { render: ({ data }: { data: any }) => JSX.Element } | undefined
  >();
  useEffect(() => {
    if (path) {
      async function loadPlugin() {
        const plugin = await import(path);
        setPluginRender(plugin.render);
      }
      loadPlugin();
    }
  }, [path]);
  if (pluginRender) {
    return pluginRender.render({ data: data });
  } else {
    return <></>;
  }
}

export function SectionRender({ section }: Props) {
  if (section.type === "featured") {
    return <FeaturedSection title={section.title} items={section.items} />;
  } else if (section.type === "video") {
    return (
      <VideoSection
        embedType={section.embedType}
        videoUrl={section.videoUrl}
        title={section.title}
      />
    );
  } else if (section.type === "call-to-action") {
    return <CallToActionSection section={section} />;
  } else if (section.type === "collections") {
    return <CollectionsSection section={section} />;
  } else if (section.type === "custom") {
    return <CustomSection section={section} />;
  } else if (section.type === "swap") {
    return <SwapSection section={section} />;
  } else if (section.type === "asset-store") {
    return <AssetStoreSection section={section} />;
  } else if (section.type === "markdown") {
    return <MDSection section={section} />;
  } else if (section.type === "wallet") {
    return <WalletSection section={section} />;
  } else if (section.type === "contract") {
    return <ContractSection section={section} />;
  } else if (section.type === "user-contract-form") {
    return <UserContractSection section={section} />;
  } else if (section.type === "plugin") {
    return <LoadPlugin data={section.data} path={section.pluginPath} />;
  }

  return <></>;
}
