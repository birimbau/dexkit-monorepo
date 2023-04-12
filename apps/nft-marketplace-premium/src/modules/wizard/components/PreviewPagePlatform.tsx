import Stack from '@mui/material/Stack';
import { useState } from 'react';
import { PreviewPortal } from 'src/components/PreviewPortal';
import { AppConfig } from '../../../types/config';
import { AppPageSection } from '../types/section';
import PreviewPage from './PreviewPage';
import { PreviewPlatformType } from './PreviewPlatformType';

interface Props {
  sections?: AppPageSection[];
  disabled?: boolean;
  withLayout?: boolean;
  appConfig?: AppConfig;
}

export default function PreviewPagePlatform({
  sections,
  disabled,
  withLayout,
  appConfig,
}: Props) {
  const [previewPlatform, setPreviewPlatform] = useState<any>('desktop');

  return (
    <>
      <Stack alignItems={'center'} spacing={2} sx={{ pb: 2 }}>
        <PreviewPlatformType
          type={previewPlatform}
          setType={(newType) => setPreviewPlatform(newType)}
        />
      </Stack>
      {previewPlatform === 'desktop' && (
        <PreviewPage
          sections={sections}
          disabled={disabled}
          previewPlatform={previewPlatform}
          withLayout={withLayout}
          appConfig={appConfig}
        />
      )}
      {previewPlatform === 'mobile' && (
        <Stack
          justifyContent={'center'}
          alignItems={'center'}
          alignContent={'center'}
        >
          <PreviewPortal>
            <PreviewPage
              sections={sections}
              disabled={disabled}
              previewPlatform={previewPlatform}
              withLayout={withLayout}
              appConfig={appConfig}
            />
          </PreviewPortal>
        </Stack>
      )}
    </>
  );
}
