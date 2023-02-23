import Button from '@mui/material/Button';
import NoSsr from '@mui/material/NoSsr';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { FormattedMessage } from 'react-intl';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import Swap from '../../../../swap/Swap';

function SwapWidget() {
  return (
    <NoSsr>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            fallbackRender={({ resetErrorBoundary, error }) => (
              <Paper sx={{ p: 1 }}>
                <Stack justifyContent="center" alignItems="center">
                  <Typography variant="h6">
                    <FormattedMessage
                      id="something.went.wrong"
                      defaultMessage="Oops, something went wrong"
                      description="Something went wrong error message"
                    />
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {String(error)}
                  </Typography>
                  <Button color="primary" onClick={resetErrorBoundary}>
                    <FormattedMessage
                      id="try.again"
                      defaultMessage="Try again"
                      description="Try again"
                    />
                  </Button>
                </Stack>
              </Paper>
            )}
          >
            <Suspense fallback={null}>
              <Swap />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </NoSsr>
  );
}

export default React.memo(SwapWidget);
