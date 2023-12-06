import AssetLeftSection from '@/modules/nft/components/AssetLeftSection';
import AssetOptionsProvider from '@/modules/nft/components/AssetOptionsProvider';
import AssetRightSection from '@/modules/nft/components/AssetRightSection';
import { ChainId } from '@dexkit/core';
import { Grid } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { fetchAssetForQueryClient } from 'src/services/nft';
import { AssetPageSection } from '../../../types/section';

export interface AssetSectionProps {
  section: AssetPageSection;
}

export default function AssetSection({ section }: AssetSectionProps) {
  const { address, tokenId, network, enableDrops } = section.config;

  const queryClient = useQueryClient();

  useEffect(() => {
    fetchAssetForQueryClient({
      item: { chainId: ChainId.Ethereum, contractAddress: address, tokenId },
      queryClient,
    });
  }, [address, tokenId, network, queryClient]);

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
        {enableDrops && <Grid item xs={12}></Grid>}
      </Grid>
    </AssetOptionsProvider>
  );
}
