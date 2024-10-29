import CategoriesContainer from "./CategoriesContainer";
import CheckoutsContainer from "./CheckoutsContainer";
import CollectionsContainer from "./CollectionsContainer";
import DashboardContainer from "./DashboardContainer";
import NotificationsContainer from "./NotificationsContainer";
import OrdersContainer from "./OrdersContainer";
import ProductsContainer from "./ProductsContainer";
import SettingsContainer from "./SettingsContainer";

export const CONTAINERS: { [key: string]: React.ReactNode } = {
  "commerce.dashboard": <DashboardContainer />,
  "commerce.notifications": <NotificationsContainer />,
  "commerce.settings": <SettingsContainer />,
  "commerce.orders": <OrdersContainer />,
  "commerce.products.items": <ProductsContainer />,
  "commerce.products.collections": <CollectionsContainer />,
  "commerce.products.categories": <CategoriesContainer />,
  "commerce.checkouts": <CheckoutsContainer />,
};

export interface CommerceContainerRendererProps {
  containerId: string;
}

export default function CommerceContainerRenderer({
  containerId,
}: CommerceContainerRendererProps) {
  return CONTAINERS[containerId];
}
