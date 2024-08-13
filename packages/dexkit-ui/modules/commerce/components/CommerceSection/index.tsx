import { CommercePageSection } from "@dexkit/ui/modules/wizard/types/section";

import useCommerce from "../../hooks/useCommerce";
import CommerceContextProvider from "../CommerceContextProvider";
import ProductContent from "./ProductContent";
import StoreContent from "./StoreContent";

export interface CommerceSectionProps {
  section: CommercePageSection;
}

function CommerceSectionComponent({ section }: CommerceSectionProps) {
  const { productId } = useCommerce();

  if (productId) {
    return <ProductContent />;
  }

  if (section.type === "commerce") {
    return <StoreContent />;
  }

  return null;
}

export default function CommerceSection({ section }: CommerceSectionProps) {
  return (
    <CommerceContextProvider>
      <CommerceSectionComponent section={section} />
    </CommerceContextProvider>
  );
}
