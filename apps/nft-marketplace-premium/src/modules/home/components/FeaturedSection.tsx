import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { SectionItem } from '../../../types/config';
import AssetFromApi from '../../nft/components/AssetFromApi';
import { CollectionFromApiCard } from '../../nft/components/CollectionFromApi';

interface Props {
  title: React.ReactNode | React.ReactNode[];
  disabled?: boolean;
  items: SectionItem[];
}

export function FeaturedSection({ title, items, disabled }: Props) {
  const renderItems = () => {
    return items.map((item, index: number) => {
      if (item.type === 'asset' && item.tokenId !== undefined) {
        return (
          <Grid item xs={6} sm={3} key={index}>
            <AssetFromApi
              chainId={item.chainId}
              contractAddress={item.contractAddress}
              tokenId={item.tokenId}
              disabled={disabled}
            />
          </Grid>
        );
      } else if (item.type === 'collection') {
        return (
          <Grid item xs={12} sm={6} key={index}>
            <CollectionFromApiCard
              totalSupply={0}
              contractAddress={item.contractAddress}
              chainId={item.chainId}
              title={item.title}
              backgroundImageUrl={item.backgroundImageUrl}
              disabled={disabled}
            />
          </Grid>
        );
      }
    });
  };

  return (
    <Box bgcolor="#111" color="#fff" py={8}>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography align="center" variant="h3" component="h1">
              {title}
            </Typography>
          </Grid>
          {renderItems()}
        </Grid>
      </Container>
    </Box>
  );
}

export default FeaturedSection;
