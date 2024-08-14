import { CommercePageSection } from "@dexkit/ui/modules/wizard/types/section";

import { Stack } from "@mui/material";
import useCommerce from "../../hooks/useCommerce";
import CommerceContextProvider from "../CommerceContextProvider";
import CartContent from "./CartContent";
import ProductContent from "./ProductContent";
import StoreContent from "./StoreContent";

export interface CommerceSectionProps {
  section: CommercePageSection;
}

function CommerceSectionComponent({ section }: CommerceSectionProps) {
  const { productId, showCart } = useCommerce();

  if (showCart) {
    return <CartContent />;
  }

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
      <Stack spacing={2}>
        <CommerceSectionComponent section={section} />
      </Stack>
    </CommerceContextProvider>
  );
}
