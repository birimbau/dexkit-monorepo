import Stack from '@mui/material/Stack';
import { useState } from 'react';
import { PreviewPortal } from 'src/components/PreviewPortal';
import { AppPageSection } from '../../../types/config';
import { PreviewPlatformType } from './PreviewPlatformType';
import PreviewPage from './PreviewPage';

interface Props {
  sections: AppPageSection[];
  disabled?: boolean;
}

export default function PreviewPagePlatform({ sections, disabled }: Props) {
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
            />
          </PreviewPortal>
        </Stack>
      )}
    </>
  );
}
