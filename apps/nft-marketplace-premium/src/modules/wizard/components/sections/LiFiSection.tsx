import { ChainId } from '@dexkit/core';
import { NETWORKS } from '@dexkit/core/constants/networks';
import { Token } from '@dexkit/core/types';
import { useConnectWalletDialog, useLogoutAccountMutation } from '@dexkit/ui';
import { ChainConfig } from '@dexkit/widgets/src/widgets/swap/types';
import { Skeleton, useTheme } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { Signer } from 'ethers';
import dynamic from 'next/dynamic';
import { Suspense, useCallback } from 'react';
import { DEFAULT_LIFI_INTEGRATOR } from 'src/constants';
import { useAppConfig } from 'src/hooks/app';
import { SwapLiFiPageSection } from '../../types/section';

const LiFiWidget = dynamic(
  () => import('@lifi/widget').then((module) => module.LiFiWidget),
  {
    ssr: false,
  },
);

const LiFiSectionEvents = dynamic(() => import('./LiFiSectionEvents'), {
  ssr: false,
});

interface Props {
  featuredTokens?: Token[];
  defaultChainId?: ChainId;
  isEdit?: boolean;
  configByChain?: { [key: number]: ChainConfig };
}

const LiFiSection = ({
  configByChain,
  featuredTokens,
  isEdit,
  defaultChainId,
}: Props) => {
  const appConfig = useAppConfig();
  console.log(appConfig.swapFees);

  const theme = useTheme();

  const { provider, account, chainId, connector } = useWeb3React();

  const connectWalletDialog = useConnectWalletDialog();

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

  const chosenChainId = isEdit
    ? defaultChainId || chainId
    : chainId || defaultChainId;

  return (
    <LiFiWidget
      integrator={DEFAULT_LIFI_INTEGRATOR}
      chains={{
        allow: Object.values(NETWORKS).map((n) => n.chainId),
      }}
      fromChain={chosenChainId}
      toChain={chosenChainId}
      fromToken={
        chosenChainId && configByChain
          ? configByChain[chosenChainId]?.sellToken?.address
          : undefined
      }
      toToken={
        chosenChainId && configByChain
          ? configByChain[chosenChainId]?.buyToken?.address
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
      fee={
        appConfig.swapFees?.amount_percentage !== undefined
          ? appConfig.swapFees?.amount_percentage / 100
          : 0
      }
      referrer={appConfig.swapFees?.recipient}
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

export default function LiFiWrapper({
  section,
  isEdit,
}: {
  section: SwapLiFiPageSection;
  isEdit?: boolean;
}) {
  return (
    <Suspense
      fallback={<Skeleton variant="rectangular" width={210} height={400} />}
    >
      <LiFiSectionEvents />
      <LiFiSection {...section.config} isEdit={isEdit} />
    </Suspense>
  );
}
