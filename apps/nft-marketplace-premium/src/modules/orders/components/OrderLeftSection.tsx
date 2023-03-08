import { Grid, Skeleton } from '@mui/material';
import { useAsset } from '../../../hooks/nft';
import { AssetDetails } from '../../nft/components/AssetDetails';
import { AssetMedia } from '../../nft/components/AssetMedia';

export function OrderLeftSection({
  address,
  id,
}: {
  address: string;
  id: string;
}) {
  const { data: asset } = useAsset(address, id);
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {asset ? <AssetMedia asset={asset} /> : <Skeleton />}
      </Grid>
      <Grid item xs={12}>
        <AssetDetails address={address} id={id} />
      </Grid>
    </Grid>
  );
}

export default OrderLeftSection;
