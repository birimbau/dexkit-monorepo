import LazyComponent from '@dexkit/ui/components/LazyComponent';
import { AppPageSection } from '@dexkit/ui/modules/wizard/types/section';
import dynamic from 'next/dynamic';
const RankingSection = dynamic(
  () =>
    import('@dexkit/dexappbuilder-viewer/components/sections/RankingSection'),
);

const CollectionSection = dynamic(
  () =>
    import(
      '@dexkit/dexappbuilder-viewer/components/sections/CollectionSection'
    ),
);

const DexGeneratorSection = dynamic(
  () =>
    import(
      '@dexkit/dexappbuilder-viewer/components/sections/DexGeneratorSection'
    ),
);

const AssetSection = dynamic(
  () =>
    import(
      '@dexkit/dexappbuilder-viewer/components/sections/AssetSection/index'
    ),
);

const TokenTradeSection = dynamic(
  () =>
    import(
      '@dexkit/dexappbuilder-viewer/components/sections/TokenTradeSection'
    ),
);

const CodeSection = dynamic(
  () => import('@dexkit/dexappbuilder-viewer/components/sections/CodeSection'),
);

const ExchangeSection = dynamic(
  () =>
    import('@dexkit/dexappbuilder-viewer/components/sections/ExchangeSection'),
);

const CallToActionSection = dynamic(
  () =>
    import(
      '@dexkit/dexappbuilder-viewer/components/sections/CallToActionSection'
    ),
);
const CollectionsSection = dynamic(
  () =>
    import(
      '@dexkit/dexappbuilder-viewer/components/sections/CollectionsSection'
    ),
);
const CustomSection = dynamic(
  () =>
    import('@dexkit/dexappbuilder-viewer/components/sections/CustomSection'),
);
const FeaturedSection = dynamic(
  () =>
    import('@dexkit/dexappbuilder-viewer/components/sections/FeaturedSection'),
);
const SwapSection = dynamic(
  () => import('@dexkit/dexappbuilder-viewer/components/sections/SwapSection'),
);
const VideoSection = dynamic(
  () => import('@dexkit/dexappbuilder-viewer/components/sections/VideoSection'),
);

const AssetStoreSection = dynamic(
  () =>
    import(
      '@dexkit/dexappbuilder-viewer/components/sections/AssetStoreSection'
    ),
);
const MDSection = dynamic(
  () => import('@dexkit/dexappbuilder-viewer/components/sections/MDSection'),
);
const WalletSection = dynamic(
  () =>
    import('@dexkit/dexappbuilder-viewer/components/sections/WalletSection'),
);
const ContractSection = dynamic(
  () =>
    import('@dexkit/dexappbuilder-viewer/components/sections/ContractSection'),
);
const UserContractSection = dynamic(
  () =>
    import(
      '@dexkit/dexappbuilder-viewer/components/sections/UserContractSection'
    ),
);

interface Props {
  section: AppPageSection;
  useLazy?: boolean;
}

export function SectionRender({ section, useLazy }: Props) {
  if (!section?.type) {
    return <></>;
  }
  const sectionToRender = () => {
    if (section.type === 'featured') {
      return <FeaturedSection title={section.title} items={section.items} />;
    } else if (section.type === 'video') {
      return (
        <VideoSection
          embedType={section.embedType}
          videoUrl={section.videoUrl}
          title={section.title}
        />
      );
    } else if (section.type === 'call-to-action') {
      return <CallToActionSection section={section} />;
    } else if (section.type === 'collections') {
      return <CollectionsSection section={section} />;
    } else if (section.type === 'custom') {
      return <CustomSection section={section} />;
    } else if (section.type === 'swap') {
      return <SwapSection section={section} />;
    } else if (section.type === 'asset-store') {
      return <AssetStoreSection section={section} />;
    } else if (section.type === 'markdown') {
      return <MDSection section={section} />;
    } else if (section.type === 'wallet') {
      return <WalletSection section={section} />;
    } else if (section.type === 'contract') {
      return <ContractSection section={section} />;
    } else if (section.type === 'user-contract-form') {
      return <UserContractSection section={section} />;
    } else if (section.type === 'exchange') {
      return <ExchangeSection section={section} />;
    } else if (section.type === 'code-page-section') {
      return <CodeSection section={section} />;
    } else if (section.type === 'collection') {
      return <CollectionSection section={section} />;
    } else if (section.type === 'dex-generator-section') {
      return <DexGeneratorSection section={section} />;
    } else if (section.type === 'asset-section') {
      return <AssetSection section={section} />;
    } else if (section.type === 'ranking') {
      return <RankingSection section={section} />;
    } else if (section.type === 'token-trade') {
      return <TokenTradeSection section={section} />;
    }
  };
  const getSection = sectionToRender();
  if (getSection) {
    if (useLazy) {
      return <LazyComponent>{getSection}</LazyComponent>;
    } else {
      return <>{getSection}</>;
    }
  }

  return <></>;
}
