import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { styled } from '@mui/material';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import '@react-page/editor/lib/index.css';

const PreviewIframe = styled('iframe')(() => ({
  border: 'none',
  height: '650px',
  width: '500px',
}));
export const PreviewPortal = (props: any) => {
  const [contentRef, setContentRef] = useState<any>(null);
  const mountNode = contentRef?.contentWindow?.document?.body;
  const cache = createCache({
    key: 'css-iframe',
    container: contentRef?.contentWindow?.document?.head,
    prepend: true,
  });

  return (
    <PreviewIframe ref={setContentRef}>
      {mountNode &&
        ReactDOM.createPortal(
          <CacheProvider value={cache}>
            <link
              type="text/css"
              rel="stylesheet"
              href="/css/react-page/editor/index.css"
            />
            <link
              type="text/css"
              rel="stylesheet"
              href="/css/react-page/plugins-image/index.css"
            />
            <link
              type="text/css"
              rel="stylesheet"
              href="/css/react-page/plugins-slate/index.css"
            />
            <link
              type="text/css"
              rel="stylesheet"
              href="/css/react-page/plugins-spacer/index.css"
            />
            <link
              type="text/css"
              rel="stylesheet"
              href="/css/react-page/plugins-video/index.css"
            />

            {props.children}
          </CacheProvider>,
          mountNode,
          'preview-mobile-key'
        )}
    </PreviewIframe>
  );
};

PreviewPortal.displayName = 'PreviewPortal';
