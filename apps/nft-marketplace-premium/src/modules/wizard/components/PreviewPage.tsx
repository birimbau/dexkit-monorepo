import { useMediaQuery, useTheme } from '@mui/material';
import { AppPageSection } from '../../../types/config';
import ActionButtonsSection from '../../home/components/ActionButtonsSection';
import CallToActionSection from '../../home/components/CallToActionSection';
import CollectionsSection from '../../home/components/CollectionsSection';
import CustomSection from '../../home/components/CustomSection';
import { FeaturedSection } from '../../home/components/FeaturedSection';
import VideoSection from '../../home/components/VideoSection';

interface Props {
  sections: AppPageSection[];
  disabled?: boolean;
  previewPlatform: 'mobile' | 'desktop';
}

export default function PreviewPage({
  sections,
  disabled,
  previewPlatform,
}: Props) {
  const renderSections = () => {
    return sections.map((section, index: number) => {
      if (previewPlatform === 'mobile' && section.hideMobile) {
        return null;
      }
      if (previewPlatform === 'desktop' && section.hideDesktop) {
        return null;
      }

      if (section.type === 'featured') {
        return (
          <FeaturedSection
            title={section.title}
            items={section.items}
            key={index}
            disabled={disabled}
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
        return (
          <CallToActionSection
            section={section}
            key={index}
            disabled={disabled}
          />
        );
      } else if (section.type === 'collections') {
        return (
          <CollectionsSection
            key={index}
            section={section}
            disabled={disabled}
          />
        );
      } else if (section.type === 'custom') {
        return <CustomSection key={index} section={section} />;
      }
    });
  };

  return <>{renderSections()}</>;
}
