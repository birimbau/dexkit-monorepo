import SwapSkeleton from '@/modules/swap/Swap.skeleton';
import { SwapConfig } from '@/modules/swap/types';
import Button from '@mui/material/Button';
import NoSsr from '@mui/material/NoSsr';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { FormattedMessage } from 'react-intl';
import Swap from '../../../../swap/Swap';

interface Props {
  formData?: SwapConfig;
  isEditMode?: boolean;
}

function SwapWidget(props: Props) {
  const { isEditMode, formData } = props;
  const defaultChainId = formData?.defaultChainId;
  const defaultEditChainId = formData?.defaultEditChainId;
  const configByChain = formData?.configByChain;

  const [chainId, setChainId] = useState(
    isEditMode ? defaultEditChainId : defaultChainId
  );

  const handleChangeChainId = (newChain: number) => {
    setChainId(newChain);
  };
  useEffect(() => {
    if (isEditMode) {
      setChainId(defaultEditChainId);
    } else {
      setChainId(defaultChainId);
    }
  }, [defaultChainId, isEditMode, defaultEditChainId]);

  const defaultSellToken = useMemo(() => {
    if (chainId && configByChain) {
      return configByChain[chainId]?.sellToken;
    }
  }, [configByChain, chainId]);

  const defaultBuyToken = useMemo(() => {
    if (chainId && configByChain) {
      return configByChain[chainId]?.buyToken;
    }
  }, [configByChain, chainId]);

  const slippage = useMemo(() => {
    if (chainId && configByChain) {
      return configByChain[chainId]?.slippage;
    }
  }, [configByChain, chainId]);

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
            <Suspense fallback={<SwapSkeleton />}>
              <Swap
                defaultChainId={chainId}
                onChangeChainId={handleChangeChainId}
                defaultSellToken={
                  defaultSellToken
                    ? {
                        address: defaultSellToken.contractAddress,
                        chainId: defaultSellToken.chainId as number,
                        decimals: defaultSellToken.decimals,
                        symbol: defaultSellToken?.symbol,
                        name: defaultSellToken.name,
                        logoURI: defaultSellToken.logoURI || '',
                      }
                    : undefined
                }
                defaultBuyToken={
                  defaultBuyToken
                    ? {
                        address: defaultBuyToken.contractAddress,
                        chainId: defaultBuyToken.chainId as number,
                        decimals: defaultBuyToken.decimals,
                        symbol: defaultBuyToken?.symbol,
                        name: defaultBuyToken.name,
                        logoURI: defaultBuyToken.logoURI || '',
                      }
                    : undefined
                }
                defaultSlippage={slippage}
                isEditMode={isEditMode}
              />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </NoSsr>
  );
}

export default React.memo(SwapWidget);
