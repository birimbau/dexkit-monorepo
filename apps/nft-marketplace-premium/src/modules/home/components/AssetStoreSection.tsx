import { AssetStoreContainer } from '@/modules/nft/components/container/AssetStoreContainer';
import { AssetStorePageSection } from '@/modules/wizard/types/section';
import Box from '@mui/material/Box';

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
