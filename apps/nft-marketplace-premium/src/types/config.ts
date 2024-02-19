import { GatedCondition, GatedPageLayout } from '@/modules/wizard/types';
import { AppPageSection } from '@/modules/wizard/types/section';
import { ThemeMode } from '@dexkit/ui/constants/enum';
import { Token } from './blockchain';

export type VideoEmbedType = 'youtube' | 'vimeo';

export type SocialMediaTypes = 'instagram' | 'facebook' | 'twitter' | 'youtube' | 'linkedin' | 'pinterest' | 'reddit';

export interface MenuTree {
  name: string;
  type: 'Page' | 'Menu' | 'External';
  href?: string;
  data?: any;
  children?: MenuTree[];
}

export interface SearchbarConfig {
  enabled?: boolean;
  hideCollections?: boolean;
  hideTokens?: boolean;
}



export interface AssetItemType {
  type: 'asset';
  title: string;
  chainId: number;
  contractAddress: string;
  tokenId: string;
}

export interface CollectionItemType {
  type: 'collection';
  variant: 'default' | 'simple';
  featured?: boolean;
  title: string;
  subtitle: string;
  backgroundImageUrl: string;
  chainId: number;
  contractAddress: string;
}

export type SectionItem = AssetItemType | CollectionItemType;

export type PageSectionVariant = 'dark' | 'light';



export interface AppPageOptions {
  key?: string;
  title?: string;
  clonedPageKey?: string;
  uri?: string;
  isEditGatedConditions?: boolean;
  gatedConditions?: GatedCondition[];
  gatedPageLayout?: GatedPageLayout;
}

export type AppPage = {
  gatedConditions?: GatedCondition[];
  sections: AppPageSection[];
} & AppPageOptions


export interface SocialMedia {
  type: SocialMediaTypes;
  handle: string;
}

export interface SocialMediaCustom {
  link: string, iconUrl: string, label: string;
}

interface SeoImage {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
  type?: string;
}

export interface PageSeo {
  title: string;
  description: string;
  images: Array<SeoImage>;
}

export interface AppCollection {
  image: string;
  name: string;
  backgroundImage: string;
  chainId: number;
  contractAddress: string;
  description?: string;
  uri?: string;
}

interface AppToken {
  name?: string;
  logoURI?: string;
  keywords?: string[];
  tags?: {
    [key: string]: {
      name: string;
      description: string;
    };
  };
  timestamp?: string;
  tokens: Token[];
}

export interface AppConfig {
  name: string;
  locale?: string;
  hide_powered_by?: boolean;
  activeChainIds?: number[];
  font?: {
    family: string;
    category?: string;
  }
  defaultThemeMode?: ThemeMode;
  theme: string;
  customTheme?: string;
  customThemeLight?: string;
  customThemeDark?: string;
  domain: string;
  email: string;
  currency: string;
  logo?: {
    width?: number;
    height?: number;
    widthMobile?: number;
    heightMobile?: number;
    url: string;
  };
  logoDark?: {
    width?: number;
    height?: number;
    widthMobile?: number;
    heightMobile?: number;
    url?: string;
  };
  favicon_url?: string;
  social?: SocialMedia[];
  social_custom?: SocialMediaCustom[];
  pages: { [key: string]: AppPage };
  transak?: { enabled: boolean };
  fees?: {
    amount_percentage: number;
    recipient: string;
  }[];
  swapFees?: {
    recipient: string;
    amount_percentage: number;
  };
  searchbar?: SearchbarConfig;
  format?: {
    date: string;
    datetime: string;
  };
  menuTree?: MenuTree[];
  footerMenuTree?: MenuTree[];
  collections?: AppCollection[];
  seo?: {
    [key: string | 'home']: PageSeo;
  };
  analytics?: {
    gtag?: string;
  }
  tokens?: AppToken[];
}
