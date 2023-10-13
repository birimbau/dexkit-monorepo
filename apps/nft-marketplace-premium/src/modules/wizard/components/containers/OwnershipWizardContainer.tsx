import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FormattedMessage } from 'react-intl';
import { SiteResponse } from 'src/types/whitelabel';
import { AppConfig } from '../../../../types/config';
import OwnershipSection from '../sections/OwnershipSection';
import HidePoweredContainer from './HidePoweredContainer';

interface Props {
  site?: SiteResponse;
  config: AppConfig;
  onSave: (config: AppConfig) => void;
}
export default function OwnershipWizardContainer({
  config,
  onSave,
  site,
}: Props) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack>
          <Typography variant={'h6'}>
            <FormattedMessage id="ownership" defaultMessage="Ownership" />
          </Typography>
          <Typography variant={'body2'}>
            <FormattedMessage
              id="ownership.settings.description"
              defaultMessage="Associate an NFT with your app for ownership control"
            />
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Alert severity="info">
          <FormattedMessage
            id="ownership.nft.info"
            defaultMessage="This NFT represents your ownership of this app. Who owns this NFT can edit it. To create or edit this NFT you need to hold 1000 KIT on one of the supported networks: Polygon, BSC or ETH. This NFT allows you to sell or transfer ownership of this app. This NFT resides on Polygon. Apps associated with an NFT are not clonable."
          />
        </Alert>
      </Grid>

      <Grid item xs={12}>
        {site?.id !== undefined && (
          <OwnershipSection id={site.id} nft={site.nft} />
        )}
      </Grid>
      <Grid item xs={12}>
        {site?.id !== undefined && (
          <HidePoweredContainer config={config} onSave={onSave} />
        )}
      </Grid>
    </Grid>
  );
}
