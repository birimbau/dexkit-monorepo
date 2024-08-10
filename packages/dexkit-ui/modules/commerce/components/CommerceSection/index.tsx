import { CommercePageSection } from "@dexkit/ui/modules/wizard/types/section";

import StoreContent from "./StoreContent";

export interface CommerceSectionProps {
  section: CommercePageSection;
}

export default function CommerceSection({ section }: CommerceSectionProps) {
  if (section.type === "commerce") {
    return <StoreContent />;
  }

  return <div></div>;
}
