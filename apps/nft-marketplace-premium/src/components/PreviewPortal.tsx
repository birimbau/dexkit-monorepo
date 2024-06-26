import { styled } from '@mui/material';
import { useMemo, useState } from 'react';

import { getWindowUrl } from '@dexkit/core/utils/browser';
import '@react-page/editor/lib/index.css';

const PreviewIframe = styled('iframe')(() => ({
  border: 'none',
  height: '500px',
  width: '500px',
}));

export interface PreviewPortalProps {
  index?: number;
  site?: string;
  page?: string;
}

export const PreviewPortal = ({ index, site, page }: PreviewPortalProps) => {
  const [contentRef, setContentRef] = useState<HTMLIFrameElement | null>(null);

  const url = useMemo(() => {
    const temp = new URL(getWindowUrl());

    temp.pathname = `/admin/preview/${site}/${page}`;

    if (index !== undefined && index >= 0) {
      temp.searchParams.set('index', index.toString());
    }

    return temp.toString();
  }, [site, page, index]);

  console.log('url', url);

  return <PreviewIframe ref={setContentRef} src={url}></PreviewIframe>;
};

PreviewPortal.displayName = 'PreviewPortal';
