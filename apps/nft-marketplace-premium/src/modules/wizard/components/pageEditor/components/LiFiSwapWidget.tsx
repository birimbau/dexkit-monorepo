import { SwapConfig } from '@/modules/swap/types';
import dynamic from 'next/dynamic';

import React, { useEffect, useState } from 'react';
import { useAllTokenList } from 'src/hooks/blockchain';
const LiFiWrapper = dynamic(() => import('../../sections/LiFiSection'));

interface Props {
  formData?: SwapConfig;
  isEditMode?: boolean;
}

function LiFiSwapWidget(props: Props) {
  const { isEditMode, formData } = props;
  const defaultChainId = formData?.defaultChainId;
  const defaultEditChainId = formData?.defaultEditChainId;
  const configByChain = formData?.configByChain;

  const [chainId, setChainId] = useState<number | undefined>(
    formData?.defaultChainId,
  );

  useEffect(() => {
    if (isEditMode) {
      setChainId(defaultEditChainId);
    }
  }, [defaultEditChainId, isEditMode]);

  const tokens = useAllTokenList({
    chainId: chainId || defaultChainId,
    includeNative: true,
    isWizardConfig: isEditMode,
  });

  return (
    <LiFiWrapper
      isEdit={true}
      section={{
        type: 'swap-lifi',
        config: {
          featuredTokens: tokens,
          defaultChainId: chainId || defaultChainId,
          configByChain: configByChain ? configByChain : {},
        },
      }}
    />
  );
}

export default React.memo(LiFiSwapWidget);

{
  /* <NoSsr>
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
</NoSsr> */
}
