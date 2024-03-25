import { OrderMarketType } from "@dexkit/exchange/constants";
import { DexkitExchangeSettings } from "@dexkit/exchange/types";
import { ContractFormParams } from "@dexkit/web3forms/types";
import React from "react";

import { AssetFormType, DeployedContract, SwapConfig } from ".";
import {
  PageSectionVariant,
  SectionItem,
  VideoEmbedType,
} from "../../../types/config";
import { AssetStoreOptions } from "../../nft/types";

export type SectionType =
  | "video"
  | "call-to-action"
  | "featured"
  | "collections"
  | "swap"
  | "custom"
  | "asset-store"
  | "markdown"
  | "wallet"
  | "contract"
  | "user-contract-form"
  | "exchange"
  | "edition-drop-section"
  | "edition-drop-list-section"
  | "token-drop"
  | "nft-drop"
  | "token-stake"
  | "nft-stake"
  | "edition-stake"
  | "token"
  | "airdrop-token"
  | "code-page-section"
  | "collection"
  | "dex-generator-section"
  | "asset-section"
  | "ranking"
  | "market-trade"
  | "token-trade"
  | "claim-airdrop-token-erc-20"
  | "carousel";

export interface PageSection {
  type: SectionType;
  title?: string;
  variant?: PageSectionVariant;
  hideMobile?: boolean;
  hideDesktop?: boolean;
}

export interface CallToActionAppPageSection extends PageSection {
  type: "call-to-action";
  title?: string;
  subtitle: string;
  button: {
    title: string;
    url: string;
    openInNewPage?: boolean;
  };
  items: SectionItem[];
}

export interface VideoEmbedAppPageSection extends PageSection {
  type: "video";
  title: string;
  embedType: VideoEmbedType;
  videoUrl: string;
}

export interface FeaturedAppPageSection extends PageSection {
  type: "featured";
  title: string;
  items: SectionItem[];
}

export interface CollectionAppPageSection extends PageSection {
  type: "collections";
  title: string;
  items: SectionItem[];
}

export interface SwapPageSection extends PageSection {
  type: "swap";
  title?: string;
  config?: SwapConfig;
}

export interface AssetStorePageSection extends PageSection {
  type: "asset-store";
  title?: string;
  config?: AssetStoreOptions;
}

export interface CustomEditorSection extends PageSection {
  type: "custom";
  title?: string;
  data: string | null | undefined;
}

export interface MarkdownEditorPageSection extends PageSection {
  type: "markdown";
  title?: string;
  config?: { source?: string };
}

export interface WalletPageSection extends PageSection {
  type: "wallet";
}

export interface ContractPageSection extends PageSection {
  type: "contract";
  config?: ContractFormParams;
}

export interface UserContractPageSection extends PageSection {
  type: "user-contract-form";
  formId: number;
  hideFormInfo?: boolean;
}

export interface TokenDropPageSection extends PageSection {
  type: "token-drop";
  settings: {
    network: string;
    address: string;
    variant?: "simple" | "detailed";
  };
}

export interface NftDropPageSection extends PageSection {
  type: "nft-drop";
  settings: {
    network: string;
    address: string;
    variant?: "simple" | "detailed";
  };
}

export interface StakeErc20PageSection extends PageSection {
  type: "token-stake";
  settings: {
    network: string;
    address: string;
  };
}

export interface StakeErc155PageSection extends PageSection {
  type: "edition-stake";
  settings: {
    network: string;
    address: string;
  };
}

export interface StakeErc721PageSection extends PageSection {
  type: "nft-stake";
  settings: {
    network: string;
    address: string;
  };
}

export interface AirdropErc20PageSection extends PageSection {
  type: "airdrop-token";
  settings: {
    network: string;
    address: string;
  };
}

export interface ClaimAirdropErc20PageSection extends PageSection {
  type: "claim-airdrop-token-erc-20";
  settings: {
    network: string;
    address: string;
  };
}

export interface TokenErc20PageSection extends PageSection {
  type: "token";
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
  type: "exchange";
  settings: DexkitExchangeSettings;
}

export interface EditionDropPageSection extends PageSection {
  type: "edition-drop-section";
  config: {
    network: string;
    address: string;
    tokenId: string;
  };
}

export interface EditionDropListPageSection extends PageSection {
  type: "edition-drop-list-section";
  config: {
    address: string;
    network: string;
  };
}

export interface CodePageSection extends PageSection {
  type: "code-page-section";
  config: {
    js: string;
    css: string;
    html: string;
  };
}

export interface MarketTradePageSection extends PageSection {
  type: "market-trade";
  config: {
    show: OrderMarketType;

    baseTokenConfig: { address: string; chainId: number };
  };
}

export interface AssetPageSection extends PageSection {
  type: "asset-section";
  config: AssetFormType;
}

export interface CollectionPageSection extends PageSection {
  type: "collection";
  config: {
    address: string;
    network: string;
    hideFilters: boolean;
    hideHeader: boolean;
    hideDrops: boolean;
    hideAssets: boolean;
  };
}

export interface TokenTradePageSection extends PageSection {
  type: "token-trade";
  config: {
    showTokenDetails?: boolean;
    show?: OrderMarketType;
    slippage?: number;
    baseTokenConfig?: { address?: string; chainId?: number };
  };
}

export interface RankingPageSection extends PageSection {
  type: "ranking";
  settings: {
    rankingId?: number;
  };
}

export interface CarouselPageSection extends PageSection {
  type: "carousel";
  settings: {
    interval?: number;
    slides: {
      title: string;
      subtitle?: string;
      imageUrl: string;
      action?: {
        caption: string;
        url: string;
        action: string;
      };
    }[];
  };
}

export type DexGeneratorPageSectionType =
  | TokenDropPageSection
  | NftDropPageSection
  | EditionDropPageSection
  | TokenErc20PageSection
  | AirdropErc20PageSection
  | StakeErc721PageSection
  | StakeErc20PageSection
  | StakeErc155PageSection
  | CollectionPageSection
  | ClaimAirdropErc20PageSection;

export interface DexGeneratorPageSection extends PageSection {
  type: "dex-generator-section";
  contract?: DeployedContract;
  section?: DexGeneratorPageSectionType;
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
  | TokenDropPageSection
  | CodePageSection
  | CollectionPageSection
  | DexGeneratorPageSection
  | AssetPageSection
  | RankingPageSection
  | ClaimAirdropErc20PageSection
  | TokenTradePageSection
  | CarouselPageSection;

export interface SectionMetadata {
  type: SectionType;
  title?: string | React.ReactNode;
  titleId?: string;
  titleDefaultMessage?: string;
  subtitle?: string | React.ReactNode;
  category?: "all" | "cryptocurrency" | "resources" | "low-code" | "nft";
  description?: string | React.ReactNode;
  icon?: string | React.ReactNode;
}
