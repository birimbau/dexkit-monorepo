import dynamic from 'next/dynamic';

const CallToActionSection = dynamic(
  () => import('@/modules/home/components/CallToActionSection')
);
const CollectionsSection = dynamic(
  () => import('@/modules/home/components/CollectionsSection')
);
const CustomSection = dynamic(
  () => import('@/modules/home/components/CustomSection')
);
const FeaturedSection = dynamic(
  () => import('@/modules/home/components/FeaturedSection')
);
const SwapSection = dynamic(
  () => import('@/modules/home/components/SwapSection')
);
const VideoSection = dynamic(
  () => import('@/modules/home/components/VideoSection')
);

import AssetStoreSection from '@/modules/home/components/AssetStoreSection';
import { MDSection } from '@/modules/home/components/MDSection';
import { AppPageSection } from '../../types/section';

interface Props {
  section: AppPageSection;
}

export function SectionRender({ section }: Props) {
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
  }

  return <></>;
}
