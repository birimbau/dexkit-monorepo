import { ChainId } from '@dexkit/core';
import { NETWORKS } from '@dexkit/core/constants/networks';
import { Token } from '@dexkit/core/types';
import { useConnectWalletDialog, useLogoutAccountMutation } from '@dexkit/ui';
import { ChainConfig } from '@dexkit/widgets/src/widgets/swap/types';
import { Skeleton, useTheme } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { Signer } from 'ethers';
import dynamic from 'next/dynamic';
import { Suspense, useCallback, useEffect } from 'react';
import { DEFAULT_LIFI_INTEGRATOR } from 'src/constants';

import { useTrackUserEventsMutation } from '@dexkit/ui/hooks/userEvents';
import type { Route } from '@lifi/sdk';
import type { RouteExecutionUpdate } from '@lifi/widget';
import { useWidgetEvents, WidgetEvent } from '@lifi/widget';

const LiFiWidget = dynamic(
  () => import('@lifi/widget').then((module) => module.LiFiWidget),
  {
    ssr: false,
  }
);

interface Props {
  featuredTokens?: Token[];
  defaultChainId?: ChainId;
  configsByChain?: { [key: number]: ChainConfig };
}

const LiFiSection = ({
  configsByChain,
  featuredTokens,
  defaultChainId,
}: Props) => {
  const theme = useTheme();
  const userEventsMutation = useTrackUserEventsMutation();

  const widgetEvents = useWidgetEvents();

  useEffect(() => {
    const onRouteExecutionStarted = (route: Route) => {
      console.log('start', route);
      // console.log('onRouteExecutionStarted fired.');
    };
    const onRouteExecutionUpdated = (update: RouteExecutionUpdate) => {
      console.log('update', update);
      // console.log('onRouteExecutionUpdated fired.');
    };
    const onRouteExecutionCompleted = (route: Route) => {
      console.log('complete', route);
      if (route.steps) {
        route.steps.forEach((step) => {
          if (step.execution) {
            if (step.execution.process) {
              step.execution.process.forEach((pr) => {
                if (pr.type === 'SWAP') {
                  userEventsMutation.mutate({});
                }
              });
            }
          }
        });
      }
      // console.log('onRouteExecutionCompleted fired.');
    };
    const onRouteExecutionFailed = (update: RouteExecutionUpdate) => {
      // console.log('onRouteExecutionFailed fired.');
    };

    widgetEvents.on(WidgetEvent.RouteExecutionStarted, onRouteExecutionStarted);
    widgetEvents.on(WidgetEvent.RouteExecutionUpdated, onRouteExecutionUpdated);
    widgetEvents.on(
      WidgetEvent.RouteExecutionCompleted,
      onRouteExecutionCompleted
    );
    widgetEvents.on(WidgetEvent.RouteExecutionFailed, onRouteExecutionFailed);

    return () => widgetEvents.all.clear();
  }, [widgetEvents]);

  const connectWalletDialog = useConnectWalletDialog();
  const { provider, account, chainId, connector } = useWeb3React();

  const logoutMutation = useLogoutAccountMutation();

  const handleSwitchWallet = () => {
    connectWalletDialog.setOpen(true);
  };

  const handleLogoutWallet = useCallback(() => {
    logoutMutation.mutate();
    if (connector?.deactivate) {
      connector.deactivate();
    } else {
      if (connector?.resetState) {
        connector?.resetState();
      }
    }
  }, [connector]);

  const chosenChainId = chainId || defaultChainId;

  return (
    <LiFiWidget
      integrator={DEFAULT_LIFI_INTEGRATOR}
      chains={{
        allow: Object.values(NETWORKS).map((n) => n.chainId),
      }}
      fromChain={chosenChainId}
      toChain={chosenChainId}
      fromToken={
        chosenChainId && configsByChain
          ? configsByChain[chosenChainId]?.sellToken?.address
          : undefined
      }
      toToken={
        chosenChainId && configsByChain
          ? configsByChain[chosenChainId]?.buyToken?.address
          : undefined
      }
      tokens={{
        featured: featuredTokens as any,
      }}
      theme={{
        palette: {
          ...theme.palette,
        },
        shape: {
          ...theme.shape,
        },
        typography: theme.typography,
      }}
      hiddenUI={['poweredBy', 'appearance', 'history', 'language']}
      walletManagement={{
        async connect() {
          if (!account) {
            connectWalletDialog.setOpen(true);
          }
          return provider?.getSigner() as Signer;
        },
        async disconnect() {
          handleLogoutWallet();
        },
        signer: account ? (provider?.getSigner() as Signer) : undefined,
      }}
    />
  );
};

export default function LiFiWrapper(props: Props) {
  return (
    <Suspense
      fallback={<Skeleton variant="rectangular" width={210} height={400} />}
    >
      <LiFiSection {...props} />
    </Suspense>
  );
}
