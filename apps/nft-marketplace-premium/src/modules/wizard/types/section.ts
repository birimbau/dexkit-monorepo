import { SwapConfig } from '@/modules/swap/types';
import { DexkitExchangeSettings } from '@dexkit/exchange/types';
import { ContractFormParams } from '@dexkit/web3forms/types';
import React from 'react';
import {
  PageSectionVariant,
  SectionItem,
  VideoEmbedType,
} from '../../../types/config';
import { AssetStoreOptions } from '../../../types/nft';

export type SectionType =
  | 'video'
  | 'call-to-action'
  | 'featured'
  | 'collections'
  | 'swap'
  | 'custom'
  | 'asset-store'
  | 'markdown'
  | 'wallet'
  | 'contract'
  | 'user-contract-form'
  | 'exchange';

export interface PageSection {
  type: SectionType;
  title?: string;
  variant?: PageSectionVariant;
  hideMobile?: boolean;
  hideDesktop?: boolean;
}

export interface CallToActionAppPageSection extends PageSection {
  type: 'call-to-action';
  title: string;
  subtitle: string;
  button: {
    title: string;
    url: string;
  };
  items: SectionItem[];
}

export interface VideoEmbedAppPageSection extends PageSection {
  type: 'video';
  title: string;
  embedType: VideoEmbedType;
  videoUrl: string;
}

export interface FeaturedAppPageSection extends PageSection {
  type: 'featured';
  title: string;
  items: SectionItem[];
}

export interface CollectionAppPageSection extends PageSection {
  type: 'collections';
  title: string;
  items: SectionItem[];
}

export interface SwapPageSection extends PageSection {
  type: 'swap';
  title?: string;
  config?: SwapConfig;
}

export interface AssetStorePageSection extends PageSection {
  type: 'asset-store';
  title?: string;
  config?: AssetStoreOptions;
}

export interface CustomEditorSection extends PageSection {
  type: 'custom';
  title?: string;
  data: string | null | undefined;
}

export interface MarkdownEditorPageSection extends PageSection {
  type: 'markdown';
  title?: string;
  config?: { source?: string };
}

export interface WalletPageSection extends PageSection {
  type: 'wallet';
}

export interface ContractPageSection extends PageSection {
  type: 'contract';
  config?: ContractFormParams;
}

export interface UserContractPageSection extends PageSection {
  type: 'user-contract-form';
  formId: number;
  hideFormInfo?: boolean;
}

export interface ExchangePageSection extends PageSection {
  type: 'exchange';
  settings: DexkitExchangeSettings;
}

export type AppPageSection =
  | CallToActionAppPageSection
  | VideoEmbedAppPageSection
  | FeaturedAppPageSection
  | CollectionAppPageSection
  | CustomEditorSection
  | SwapPageSection
  | AssetStorePageSection
  | MarkdownEditorPageSection
  | WalletPageSection
  | ContractPageSection
  | UserContractPageSection
  | ExchangePageSection;

export interface SectionMetadata {
  type: SectionType;
  title?: string | React.ReactNode;
  subtitle?: string;
  icon?: string;
}
