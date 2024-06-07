import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { CssBaseline, ThemeProvider, styled, useTheme } from '@mui/material';
import { useState } from 'react';
import ReactDOM from 'react-dom';

import '@react-page/editor/lib/index.css';

const PreviewIframe = styled('iframe')(() => ({
  border: 'none',
  height: '500px',
  width: '500px',
}));

export const PreviewPortal = (props: any) => {
  const [contentRef, setContentRef] = useState<HTMLIFrameElement | null>(null);

  const mountNode = contentRef?.contentWindow?.document?.body;

  const cache = createCache({
    key: 'css',
    container: contentRef?.contentWindow?.document?.head,
    prepend: true,
  });

  const theme = useTheme();

  return (
    <CacheProvider value={cache}>
      <PreviewIframe ref={setContentRef}>
        {mountNode &&
          ReactDOM.createPortal(
            <>
              <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
              />
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
              <ThemeProvider theme={theme}>
                <CssBaseline />
                {props.children}
              </ThemeProvider>
            </>,
            mountNode,
            'preview-mobile-key'
          )}
      </PreviewIframe>
    </CacheProvider>
  );
};

PreviewPortal.displayName = 'PreviewPortal';
