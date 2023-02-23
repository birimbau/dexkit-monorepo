import { Box, CardMedia, Paper, Skeleton } from '@mui/material';
import { useAssetMetadata } from '../../../hooks/nft';
import { Asset } from '../../../types/nft';
import { getNFTMediaSrcAndType } from '../../../utils/nfts';
import { AssetIframe } from './AssetIframe';
import { AssetImage } from './AssetImage';
import { AssetVideo } from './AssetVideo';

interface Props {
  asset: Asset;
}

export function AssetMedia({ asset }: Props) {
  const { data: metadata, isLoading } = useAssetMetadata(asset);

  if (isLoading) {
    return <Skeleton />;
  }

  const nftSrcAndType = getNFTMediaSrcAndType(
    asset.contractAddress,
    asset.chainId,
    asset.id,
    metadata
  );

  return (
    <Paper sx={{ maxWidth: '100%', height: 'auto' }}>
      <CardMedia
        component="div"
        sx={{ display: 'block', maxWidth: '100%', height: 'auto' }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
          }}
        >
          {nftSrcAndType.type === 'image' && metadata?.image && (
            <AssetImage src={metadata?.image} />
          )}
          {nftSrcAndType.type === 'iframe' && nftSrcAndType.src && (
            <AssetIframe src={nftSrcAndType.src} />
          )}
          {nftSrcAndType.type === 'mp4' && metadata?.animation_url && (
            <AssetVideo src={metadata?.animation_url} />
          )}
        </Box>
      </CardMedia>
    </Paper>
  );
}
