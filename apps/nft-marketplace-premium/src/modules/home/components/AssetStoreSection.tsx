import { AssetStoreContainer } from '@/modules/nft/components/container/AssetStoreContainer';
import Box from '@mui/material/Box';
import { AssetStorePageSection } from '../../../types/config';

interface Props {
  section: AssetStorePageSection;
}

export function AssetStoreSection({ section }: Props) {
  return (
    <Box py={4}>
      <AssetStoreContainer {...section.config} />
    </Box>
  );
}

export default AssetStoreSection;
