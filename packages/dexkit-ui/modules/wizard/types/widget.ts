import { ThemeMode } from "../../../constants/enum";
import { AppCollection, AppPage, AppToken } from "./config";
import { AppPageSection } from "./section";



export interface WidgetConfig {
  id?: number;
  name: string;
  locale: string;
  currency: string;
  owner: string;
  activeChainIds?: number[];
  page: AppPage;
  defaultThemeMode?: ThemeMode;
  theme: string;
  customThemeLight?: string;
  customThemeDark?: string;
  collections?: AppCollection[];
  font?: {
    family: string;
    category?: string;
  };
  fees?: {
    amount_percentage: number;
    recipient: string;
  }[];
  swapFees?: {
    recipient: string;
    amount_percentage: number;
  };
  tokens?: AppToken[];


}