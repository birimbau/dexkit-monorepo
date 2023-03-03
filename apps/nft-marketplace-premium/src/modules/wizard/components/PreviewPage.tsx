import SwapSection from '@/modules/home/components/SwapSection';
import MainLayout from 'src/components/layouts/main';
import { AppConfig, AppPageSection } from '../../../types/config';
import CallToActionSection from '../../home/components/CallToActionSection';
import CollectionsSection from '../../home/components/CollectionsSection';
import CustomSection from '../../home/components/CustomSection';
import { FeaturedSection } from '../../home/components/FeaturedSection';
import VideoSection from '../../home/components/VideoSection';

interface Props {
  sections?: AppPageSection[];
  disabled?: boolean;
  previewPlatform: 'mobile' | 'desktop';
  withLayout?: boolean;
  appConfig?: AppConfig;
}

export default function PreviewPage({
  sections,
  disabled,
  previewPlatform,
  withLayout,
  appConfig,
}: Props) {
  const renderSections = () => {
    return (sections || []).map((section, index: number) => {
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
      } else if (section.type === 'swap') {
        return <SwapSection key={index} section={section} />;
      }
    });
  };
  if (withLayout) {
    return (
      <MainLayout disablePadding appConfigProps={appConfig} isPreview={true}>
        {renderSections() || null}{' '}
      </MainLayout>
    );
  } else {
    return <>{renderSections() || null}</>;
  }
}
