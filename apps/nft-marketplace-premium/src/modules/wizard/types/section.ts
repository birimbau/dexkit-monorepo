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
  | 'exchange'
  | 'edition-drop-section'
  | 'edition-drop-list-section'
  | 'token-drop'
  | 'nft-drop'
  | 'token-stake'
  | 'nft-stake'
  | 'edition-stake'
  | 'token'
  | 'airdrop-token';

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

export interface TokenDropPageSection extends PageSection {
  type: 'token-drop';
  settings: {
    network: string;
    address: string;
    variant?: 'simple' | 'detailed';
  };
}

export interface NftDropPageSection extends PageSection {
  type: 'nft-drop';
  settings: {
    network: string;
    address: string;
    variant?: 'simple' | 'detailed';
  };
}

export interface StakeErc20PageSection extends PageSection {
  type: 'token-stake';
  settings: {
    network: string;
    address: string;
  };
}

export interface StakeErc155PageSection extends PageSection {
  type: 'edition-stake';
  settings: {
    network: string;
    address: string;
  };
}

export interface StakeErc721PageSection extends PageSection {
  type: 'nft-stake';
  settings: {
    network: string;
    address: string;
  };
}

export interface AirdropErc20PageSection extends PageSection {
  type: 'airdrop-token';
  settings: {
    network: string;
    address: string;
  };
}

export interface TokenErc20PageSection extends PageSection {
  type: 'token';
  settings: {
    network: string;
    address: string;
    disableTransfer?: boolean;
    disableBurn?: boolean;
    disableMint?: boolean;
    disableInfo?: boolean;
  };
}

export interface ExchangePageSection extends PageSection {
  type: 'exchange';
  settings: DexkitExchangeSettings;
}
export interface EditionDropPageSection extends PageSection {
  type: 'edition-drop-section';
  config: {
    address: string;
    tokenId: string;
  };
}

export interface EditionDropListPageSection extends PageSection {
  type: 'edition-drop-list-section';
  config: {
    address: string;
    network: string;
  };
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
  | ExchangePageSection
  | EditionDropListPageSection
  | TokenDropPageSection;

export interface SectionMetadata {
  type: SectionType;
  title?: string | React.ReactNode;
  subtitle?: string;
  icon?: string;
}
