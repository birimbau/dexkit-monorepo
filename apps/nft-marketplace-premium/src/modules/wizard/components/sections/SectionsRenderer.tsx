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
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

import { AppPageSection } from 'src/types/config';

interface Props {
  sections: AppPageSection[];
}

export function SectionsRenderer({ sections }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const sectionsToRender = sections.map((section, index: number) => {
    if (isMobile && section.hideMobile) {
      return null;
    }
    if (!isMobile && section.hideDesktop) {
      return null;
    }

    if (section.type === 'featured') {
      return (
        <FeaturedSection
          title={section.title}
          items={section.items}
          key={index}
        />
      );
    } else if (section.type === 'video') {
      return (
        <VideoSection
          embedType={section.embedType}
          videoUrl={section.videoUrl}
          title={section.title}
          key={index}
        />
      );
    } else if (section.type === 'call-to-action') {
      return <CallToActionSection section={section} key={index} />;
    } else if (section.type === 'collections') {
      return <CollectionsSection key={index} section={section} />;
    } else if (section.type === 'custom') {
      return <CustomSection key={index} section={section} />;
    } else if (section.type === 'swap') {
      return <SwapSection key={index} section={section} />;
    }
  });

  return <>{sectionsToRender}</>;
}
