import dynamic from 'next/dynamic';
import LazyComponent from 'src/components/LazyComponent';
import { AppPageSection } from '../../types/section';
import RankingSection from '../sections/RankingSection';

const CollectionSection = dynamic(
  () => import('../sections/CollectionSection'),
);

const DexGeneratorSection = dynamic(
  () => import('../sections/DexGeneratorSection'),
);

const AssetSection = dynamic(() => import('../sections/AssetSection/index'));

const TokenTradeSection = dynamic(
  () => import('../sections/TokenTradeSection'),
);

const CodeSection = dynamic(() => import('../sections/CodeSection'));

const ExchangeSection = dynamic(() => import('../sections/ExchangeSection'));

const CallToActionSection = dynamic(
  () => import('@/modules/home/components/CallToActionSection'),
);
const CollectionsSection = dynamic(
  () => import('@/modules/home/components/CollectionsSection'),
);
const CustomSection = dynamic(
  () => import('@/modules/home/components/CustomSection'),
);
const FeaturedSection = dynamic(
  () => import('@/modules/home/components/FeaturedSection'),
);
const SwapSection = dynamic(
  () => import('@/modules/home/components/SwapSection'),
);
const VideoSection = dynamic(
  () => import('@/modules/home/components/VideoSection'),
);

const AssetStoreSection = dynamic(
  () => import('@/modules/home/components/AssetStoreSection'),
);
const MDSection = dynamic(() => import('@/modules/home/components/MDSection'));
const WalletSection = dynamic(
  () => import('@/modules/home/components/WalletSection'),
);
const ContractSection = dynamic(() => import('../sections/ContractSection'));
const UserContractSection = dynamic(
  () => import('../sections/UserContractSection'),
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
