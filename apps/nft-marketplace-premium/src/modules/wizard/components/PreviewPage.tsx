import MainLayout from 'src/components/layouts/main';
import { AppConfig } from '../../../types/config';
import { AppPageSection } from '../types/section';
import { SectionRender } from './section-config/SectionRender';

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
    return (sections || []).map((section, key) => {
      if (previewPlatform === 'mobile' && section?.hideMobile) {
        return null;
      }
      if (previewPlatform === 'desktop' && section?.hideDesktop) {
        return null;
      }

      return <SectionRender section={section} key={key} />;
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
