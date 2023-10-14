import { getNormalizedUrl } from '@dexkit/core/utils';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  Skeleton,
  Typography,
} from '@mui/material';
import { NFT } from '@thirdweb-dev/sdk';
import Link from 'src/components/Link';

export interface NFTGridProps {
  nfts: NFT[];
  address: string;
  network: string;
}

export default function NFTGrid({ nfts, network, address }: NFTGridProps) {
  return (
    <Grid container spacing={2}>
      {nfts.map((nft, key) => (
        <Grid item xs={6} sm={3} key={key}>
          <Card>
            <CardActionArea
              LinkComponent={Link}
              href={`/contract/${network}/${address}/${nft.metadata.id}`}
            >
              {nft.metadata.image ? (
                <CardMedia
                  image={getNormalizedUrl(nft.metadata.image)}
                  sx={{ aspectRatio: '1/1', height: '100%' }}
                />
              ) : (
                <Skeleton
                  variant="rectangular"
                  sx={{ aspectRatio: '16/9', height: '100%' }}
                />
              )}
            </CardActionArea>
            <Divider />
            <CardContent>
              <Typography variant="caption" color="primary">
                <Link
                  href={`/contract/${network}/${address}/${nft.metadata.id}`}
                >
                  {nft.metadata.name}
                </Link>
              </Typography>
              <Typography>#{nft.metadata.id}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
