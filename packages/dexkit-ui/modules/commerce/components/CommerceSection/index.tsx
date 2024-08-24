import { CommercePageSection } from "@dexkit/ui/modules/wizard/types/section";

import { Box, Stack } from "@mui/material";
import useCommerce from "../../hooks/useCommerce";
import CommerceContextProvider from "../CommerceContextProvider";
import CartContent from "./CartContent";
import CheckoutContent from "./CheckoutContent";
import CollectionContent from "./CollectionContent";
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

  if (section.type === "commerce") {
    if (section.settings.content.type === "store") {
      if (productId) {
        return <ProductContent productId={productId} />;
      }
      return <StoreContent />;
    } else if (section.settings.content.type === "checkout") {
      return <CheckoutContent id={section.settings.content.id} />;
    } else if (section.settings.content.type === "collection") {
      return <CollectionContent id={section.settings.content.id} />;
    } else if (section.settings.content.type === "single-product") {
      return (
        <ProductContent productId={section.settings.content.id} disableHeader />
      );
    }
  }

  return null;
}

export default function CommerceSection({ section }: CommerceSectionProps) {
  return (
    <CommerceContextProvider section={section}>
      <Stack spacing={2} sx={{ py: 2 }}>
        <Box>
          <CommerceSectionComponent section={section} />
        </Box>
      </Stack>
    </CommerceContextProvider>
  );
}
