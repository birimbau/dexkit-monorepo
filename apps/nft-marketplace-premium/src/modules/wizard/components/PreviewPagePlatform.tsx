import Box from '@mui/material/Box';
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
  title?: React.ReactNode;
  enableOverflow?: boolean;
}

export default function PreviewPagePlatform({
  sections,
  disabled,
  withLayout,
  appConfig,
  title,
  enableOverflow,
}: Props) {
  const [previewPlatform, setPreviewPlatform] = useState<any>('desktop');

  const pagePreview = (
    <PreviewPage
      sections={sections}
      disabled={disabled}
      previewPlatform={previewPlatform}
      withLayout={withLayout}
      appConfig={appConfig}
    />
  );

  return (
    <>
      <Stack
        alignItems={'center'}
        direction={'row'}
        justifyContent={'center'}
        alignContent={'center'}
        spacing={2}
        sx={{ pb: 2, pt: 2, backgroundColor: 'background.default' }}
      >
        {title ? title : null}
        <PreviewPlatformType
          type={previewPlatform}
          setType={(newType) => setPreviewPlatform(newType)}
        />
      </Stack>
      <Box sx={{ p: 2 }}>
        {previewPlatform === 'desktop' &&
          (enableOverflow ? (
            <Box
              sx={{
                maxHeight: '500px',
                overflow: 'auto',
              }}
            >
              {pagePreview}
            </Box>
          ) : (
            <>{pagePreview}</>
          ))}
        {previewPlatform === 'mobile' && (
          <Stack
            justifyContent={'center'}
            alignItems={'center'}
            alignContent={'center'}
          >
            <PreviewPortal>{pagePreview}</PreviewPortal>
          </Stack>
        )}
      </Box>
    </>
  );
}
