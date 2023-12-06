import AssetLeftSection from '@/modules/nft/components/AssetLeftSection';
import AssetOptionsProvider from '@/modules/nft/components/AssetOptionsProvider';
import AssetRightSection from '@/modules/nft/components/AssetRightSection';
import { NETWORK_FROM_SLUG } from '@dexkit/core/constants/networks';
import { hexToString } from '@dexkit/ui/utils';
import { useAsyncMemo } from '@dexkit/widgets/src/hooks';
import { Alert, Box, Grid, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { ThirdwebSDKProvider, useContract } from '@thirdweb-dev/react';
import { useWeb3React } from '@web3-react/core';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { fetchAssetForQueryClient } from 'src/services/nft';
import { AssetPageSection } from '../../../types/section';
import EditionDropSection from '../EditionDropSection';

interface DropWrapperProps {
  tokenId: string;
  address: string;
}

function DropWrapper({ tokenId, address }: DropWrapperProps) {
  const { data: contract } = useContract(address);

  const isDrop = useAsyncMemo(
    async () => {
      if (!contract) {
        return false;
      }
      try {
        const contractType = hexToString(await contract?.call('contractType'));

        return contractType === 'DropERC1155';
      } catch (err) {
        return false;
      }
    },
    false,
    [contract],
  );

  if (isDrop) {
    return (
      <EditionDropSection
        section={{
          type: 'edition-drop-section',
          config: {
            tokenId: tokenId as string,
            address: address as string,
          },
        }}
      />
    );
  }

  return (
    <Box>
      <Alert severity="warning">
        <Typography>
          <FormattedMessage
            id="drops.are.not.available.for.this.contract"
            defaultMessage="Drops are not available for this contract"
          />
        </Typography>
      </Alert>
    </Box>
  );
}

export interface AssetSectionProps {
  section: AssetPageSection;
}

export default function AssetSection({ section }: AssetSectionProps) {
  const { address, tokenId, network, enableDrops } = section.config;

  const queryClient = useQueryClient();

  useEffect(() => {
    const chainId = NETWORK_FROM_SLUG(network)?.chainId;

    if (chainId) {
      fetchAssetForQueryClient({
        item: { chainId, contractAddress: address, tokenId },
        queryClient,
      });
    }
  }, [address, tokenId, network, queryClient]);

  const { provider } = useWeb3React();

  return (
    <AssetOptionsProvider
      key={`${network}-${address}-${tokenId}`}
      options={{ options: {} }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <AssetLeftSection address={address} id={tokenId} />
        </Grid>
        <Grid item xs={12} sm={8}>
          <AssetRightSection address={address} id={tokenId} />
        </Grid>
        {enableDrops && (
          <Grid item xs={12}>
            <ThirdwebSDKProvider
              activeChain={NETWORK_FROM_SLUG(network)?.chainId}
              signer={provider?.getSigner()}
            >
              <DropWrapper address={address} tokenId={tokenId} />
            </ThirdwebSDKProvider>
          </Grid>
        )}
      </Grid>
    </AssetOptionsProvider>
  );
}
