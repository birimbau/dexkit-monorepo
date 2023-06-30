import dynamic from "next/dynamic";
import { AppPageSection } from "../types";
import AssetStoreSection from "./sections/AssetStoreSection";
import { MDSection } from "./sections/MDSection";

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

import ContractSection from "./sections/ContractSection";
import UserContractSection from "./sections/UserContractSection";

interface Props {
  section: AppPageSection;
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
  }

  return <></>;
}
