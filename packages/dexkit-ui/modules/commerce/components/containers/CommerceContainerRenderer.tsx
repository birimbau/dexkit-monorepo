import DashboardContainer from "./DashboardContainer";
import NotificationsContainer from "./NotificationsContainer";
import OrdersContainer from "./OrdersContainer";
import SettingsContainer from "./SettingsContainer";

export const CONTAINERS: { [key: string]: React.ReactNode } = {
  "commerce.dashboard": <DashboardContainer />,
  "commerce.notifications": <NotificationsContainer />,
  "commerce.settings": <SettingsContainer />,
  "commerce.orders": <OrdersContainer />,
};

export interface CommerceContainerRendererProps {
  containerId: string;
}

export default function CommerceContainerRenderer({
  containerId,
}: CommerceContainerRendererProps) {
  return CONTAINERS[containerId];
}
